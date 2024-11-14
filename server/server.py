"""
Flask Web Application for Face Recognition and Event Photo Matching

This application uses Flask to handle uploads of face images, matches them against a
pre-existing dataset of face encodings for specific events, and returns identified
or non-identified images associated with the user-uploaded image.

Modules:
    - face_recognition: For face detection and encoding
    - hashlib and base64: For generating unique event folder names
    - os: For file and directory management
    - Flask modules (Flask, request, render_template): For web application functionality

Author: [Noah van Potten]

"""

from flask import Flask, request, render_template
import os
import face_recognition
import hashlib
import base64
import numpy as np
from PIL import Image, ExifTags
from pillow_heif import register_heif_opener

app = Flask(__name__)

# Set up the base directory and uploads folder
BASE_DIR = os.path.abspath(os.path.dirname(__file__))  # Absolute path to the script's directory
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')      # Upload folder path
os.makedirs(UPLOAD_FOLDER, exist_ok=True)              # Ensure the upload folder exists

def load_img(image_path):
    """
    Load an image file, handle HEIC formats, and adjust orientation if necessary.

    Parameters:
    - image_path (str): Path to the image file to be processed.

    Returns:
    - numpy.ndarray: The loaded image as a numpy array, adjusted for orientation if required.
    """
    register_heif_opener()

    img = Image.open(image_path)

    # Check for orientation EXIF data and adjust if necessary
    exif = img._exif
    if exif is None:
        exif = img._getexif()

    if exif:
        for orientation in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientation] == 'Orientation':
                orientation_value = exif.get(orientation)

                if orientation_value == 1:
                    # Normal (no rotation or flip)
                    pass
                elif orientation_value == 2:
                    # Flipped horizontally
                    img = img.transpose(Image.FLIP_LEFT_RIGHT)
                elif orientation_value == 3:
                    # Upside down (180 degrees rotation)
                    img = img.rotate(180, expand=True)
                elif orientation_value == 4:
                    # Flipped vertically
                    img = img.transpose(Image.FLIP_TOP_BOTTOM)
                elif orientation_value == 5:
                    # 90 degrees counterclockwise and flipped horizontally
                    img = img.rotate(270, expand=True)
                    img = img.transpose(Image.FLIP_LEFT_RIGHT)
                elif orientation_value == 6:
                    # 90 degrees clockwise (90 degrees rotation)
                    img = img.rotate(270, expand=True)
                elif orientation_value == 7:
                    # 90 degrees clockwise and flipped horizontally
                    img = img.rotate(90, expand=True)
                    img = img.transpose(Image.FLIP_LEFT_RIGHT)
                elif orientation_value == 8:
                    # 90 degrees counterclockwise (270 degrees rotation)
                    img = img.rotate(90, expand=True)

    # Convert the adjusted image to a numpy array for face_recognition
    uploaded_image = np.array(img)
    return uploaded_image

def find_match(image_path, outputs_folder, tolerance=0.6):
    """
    Find a matching face in the dataset based on the uploaded image.

    Parameters:
    - image_path (str): Path to the uploaded image.
    - outputs_folder (str): Name of the folder containing the dataset of encodings.
    - tolerance (float): Face comparison tolerance level (default is 0.6).

    Returns:
    - tuple: Person ID, list of URLs and if an error occurred if a match is found, otherwise a message and empty list and the error flag.
    """

    uploaded_image = load_img(image_path)
    # Process the image with face_recognition
    uploaded_encodings = face_recognition.face_encodings(uploaded_image)

    if len(uploaded_encodings) != 1:

        return "", [], f"{len(uploaded_encodings)} faces detected in uploaded image. Please only include one person on your selfie."

    uploaded_encoding = uploaded_encodings[0]

    urls = []
    person_ids = []
    # Open the file containing encodings for comparison
    with open(os.path.join(BASE_DIR, f"static/datasets/{outputs_folder}/encodings.txt"), "r") as file:
        for line in file:
            person_id, pictures, encoding_str = line.strip().split(":")
            db_encoding = list(map(float, encoding_str.split(",")))

            # Compare the uploaded encoding with the stored encoding
            if face_recognition.compare_faces([db_encoding], uploaded_encoding, tolerance=tolerance)[0]:
                person_ids.append(person_id)
                for picture_id in pictures.split(","):
                    picture_url = f"datasets/{outputs_folder}/pictures/picture_{picture_id.strip()}.jpg" 
                    if not picture_url in urls:
                        urls.append(picture_url)
                print(f"Match found: {person_id}, URLs: {urls}")
    return person_ids, urls, ""

def calculate_folder_name(event_name, event_code):
    """
    Generate a unique folder name for an event using SHA-256 hash and Base64 encoding.

    Parameters:
    - event_name (str): Name of the event.
    - event_code (str): Unique event code.

    Returns:
    - str: A unique 16-character folder name.
    """
    combined_str = f"{event_name}|{event_code}".encode()
    hash_object = hashlib.sha256(combined_str)
    encoded = base64.urlsafe_b64encode(hash_object.digest()).decode('utf-8')
    return encoded[:16]

def non_identified_urls(folder_name):
    """
    Retrieve URLs for non-identified pictures.

    Parameters:
    - folder_name (str): The folder name containing the non-identified images.

    Returns:
    - list: URLs for non-identified images.
    """
    with open(os.path.join(BASE_DIR, f"static/datasets/{folder_name}/non_identified.txt"), "r") as file:
        ids = file.readlines()[0].split(",")
    return [f"datasets/{folder_name}/pictures/picture_{picture_id.strip()}.jpg" for picture_id in ids if picture_id]

@app.route('/')
def main():
    """Render the main upload page."""
    return render_template("main.html")

@app.route('/results', methods=['POST'])
def results():
    """
    Handle file upload, perform face matching, and render the results page.

    Returns:
    - Rendered template with matched person ID, picture URLs, and event details.
    """
    try:
        if request.method == 'POST':
            f = request.files['file']
            name = request.form['name']
            event_type = request.form['event']
            event_code = request.form['event_code']
            print(name, event_type, f.filename)

            # Save the uploaded file
            file_path = os.path.join(UPLOAD_FOLDER, f.filename)
            f.save(file_path)

            # Calculate folder name and perform face matching
            folder_name = calculate_folder_name(event_name=event_type, event_code=event_code)
            match, urls, error = find_match(file_path, folder_name)

            if error != "":
                return render_template("error.html", message=error)
            return render_template("results.html", personid=match, picture_urls=urls, picture_amount=len(urls), event=event_type, name=name, event_code=event_code)
    except Exception as e:
        error_message = str(e)
        return render_template("error.html", message=error_message)

@app.route('/non_identified', methods=['GET', 'POST'])
def non_identified():
    """
    Retrieve and display non-identified images for an event.

    Returns:
    - Rendered template with URLs of non-identified pictures.
    """
    try:
        event_type = request.args.get('event')
        event_code = request.args.get('event_code')
        print(f"event_code: {event_code}, event_type: {event_type}")

        folder_name = calculate_folder_name(event_name=event_type, event_code=event_code)
        urls = non_identified_urls(folder_name)

        return render_template("non_identified.html", picture_amount=len(urls), picture_urls=urls, event_type=event_type)
    except Exception as e:
        error_message = str(e)
        return render_template("error.html", message=error_message)

if __name__ == '__main__':
    app.run(debug=True)
