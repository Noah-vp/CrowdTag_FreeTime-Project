# Event Photo Matching and Face Recognition System

This repository contains a Flask web application designed to facilitate photo management for events by using face recognition. The application allows users to upload images, matches the detected faces against a pre-existing dataset of known event attendees, and categorizes the images based on identification. The project is ideal for event organizers who want to provide personalized photos to attendees by automatically identifying and grouping individuals.

## Features
- **Face Recognition and Matching**: Upload an image, and the app will identify matching faces within the event's dataset.
- **Secure Event Folders**: Each event is assigned a unique folder using a hash function to keep photo categorization secure and organized.
- **Non-Identified Images**: Access photos where faces were not matched with any attendee, simplifying manual categorization.
- **User-Friendly Interface**: Simple upload form and easy navigation between matched results and non-identified images.

## Project Structure
- **app.py**: Core application logic, including routes for image upload, face matching, and displaying results.
- **Templates**: HTML templates for main pages, results, and error handling.
- **JavaScript Scripts**: Frontend scripts to enhance the user experience with loading animations and file upload previews.
- **Static Files**: Encoded face data and images are organized in a static folder for easy access and management.

## Setup and Requirements
- **Python Libraries**: Install Flask and face_recognition to support backend processing.
- **Folder Structure**: Make sure the `/uploads` and `/static/datasets` directories are correctly structured for image storage and face data.
- **Encoding Files**: Prepare encoding files with participant information for effective matching.

This project demonstrates the integration of face recognition with Flask, providing a streamlined photo management system for events.
