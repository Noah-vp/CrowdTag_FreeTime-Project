/**
 * JavaScript code for handling the "Contact Us" form functionality.
 * This script initializes EmailJS to send emails, manages the form submission process,
 * and handles popup interactions for success and error notifications.
 */

// Initialize EmailJS with the User ID
(function () {
  emailjs.init("AbpoErjyFC5049-tp"); // Replace with your EmailJS User ID
})();

// Handle form submission for the "Contact Us" form
document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission behavior (page reload)
    document.getElementById("popupOverlay").style.display = "none"; // Close the initial popup

    // Collect data from the form fields
    var formData = {
      contactName: document.getElementById("contactName").value, // User's name
      contactEmail: document.getElementById("contactEmail").value, // User's email address
      contactMessage: document.getElementById("contactMessage").value, // User's message
    };

    // References to success and error popups and their close buttons
    const successPopup = document.getElementById("successPopup");
    const errorPopup = document.getElementById("errorPopup");
    const closeSuccessPopup = document.getElementById("closeSuccessPopup");
    const closeErrorPopup = document.getElementById("closeErrorPopup");

    // Functions to display or hide the success popup
    function showSuccessPopup() {
      successPopup.style.display = "flex"; // Display the success popup
    }
    function hideSuccessPopup() {
      successPopup.style.display = "none"; // Hide the success popup
    }

    // Functions to display or hide the error popup
    function showErrorPopup() {
      errorPopup.style.display = "flex"; // Display the error popup
    }
    function hideErrorPopup() {
      errorPopup.style.display = "none"; // Hide the error popup
    }

    // Attach event listeners to the close buttons of the popups
    closeSuccessPopup.addEventListener("click", hideSuccessPopup); // Close success popup
    closeErrorPopup.addEventListener("click", hideErrorPopup); // Close error popup

    // Send the email using EmailJS
    emailjs
      .send("service_i1m22vx", "template_j84x19l", formData) // Replace with your EmailJS Service and Template IDs
      .then(
        function (response) {
          showSuccessPopup(); // Show success notification on successful email send
        },
        function (error) {
          showErrorPopup(); // Show error notification if email send fails
        }
      );
  });
