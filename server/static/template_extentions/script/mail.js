import emailjs from "https://cdn.emailjs.com/dist/email.min.js";

// Initialize EmailJS
(function () {
  emailjs.init("AbpoErjyFC5049-tp"); // Replace with your EmailJS User ID
})();

// Form submission handling
document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    // Get form data
    var formData = {
      contactName: document.getElementById("contactName").value,
      contactEmail: document.getElementById("contactEmail").value,
      contactMessage: document.getElementById("contactMessage").value,
    };

    // Send the email using EmailJS
    emailjs.send("service_i1m22vx", "template_2j793ib", formData).then(
      function (response) {
        console.log("Email sent successfully:", response);
        alert("Your message has been sent!");
        // Optionally reset the form
        document.getElementById("contactForm").reset();
      },
      function (error) {
        console.error("Error sending email:", error);
        alert("Failed to send your message. Please try again later.");
      }
    );
  });
