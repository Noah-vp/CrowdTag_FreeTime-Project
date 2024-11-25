/**
 * JavaScript code for managing the file upload process on the upload.html page.
 * This script handles updating the displayed file name, toggling visibility between
 * the input form and a loading indicator, and controlling the form submission flow.
 */

/**
 * Updates the displayed file name when a user selects a file.
 */
function updateFileName() {
  const fileInput = document.getElementById("file"); // Get the file input element
  const fileNameDisplay = document.getElementById("file-name"); // Get the element to display the file name

  // Update the displayed file name or show a default message if no file is selected
  fileNameDisplay.textContent =
    fileInput.files.length > 0 ? fileInput.files[0].name : "No file chosen";
}

/**
 * Toggles visibility between the loading spinner and the input form.
 */
function toggleVisibility() {
  const loaderDiv = document.getElementById("loader"); // Get the loader (spinner) element
  const inputDiv = document.getElementById("input"); // Get the input form element

  // Show the loader and hide the input form
  loaderDiv.style.display = "flex"; // Display the loader (flex for centering)
  inputDiv.style.display = "none"; // Hide the input form
}

/**
 * Handles the file upload form submission process.
 * @param {Event} event - The form submission event.
 */
function handleFormSubmit(event) {
  event.preventDefault(); // Prevent the default form submission behavior (e.g., page reload)
  toggleVisibility(); // Show the loader and hide the input form

  // Delay the actual form submission slightly to ensure the loader is visible
  setTimeout(() => {
    event.target.submit(); // Programmatically submit the form
  }, 500); // Delay in milliseconds (adjust as needed)
}
