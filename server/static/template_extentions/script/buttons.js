/**
 * JavaScript code for handling button interactions on the landing page (main.html).
 * This script adds functionality to contact buttons, expandable sections, and menu toggles,
 * ensuring smooth user interactions and dynamic content updates.
 */

// Import i18next for internationalization
import i18next from "https://deno.land/x/i18next/index.js";

// Attach event listeners when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add event listeners to all "Contact" buttons
  const contact_btns = document.getElementsByClassName("contact-btn");
  for (let i = 0; i < contact_btns.length; i++) {
    contact_btns[i].addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default button behavior
      togglePopup(); // Open the contact popup
    });
  }

  // Add event listeners to all "Learn More" buttons
  const expend_btns = document.getElementsByClassName("learn-more-btn");
  for (let i = 0; i < expend_btns.length; i++) {
    expend_btns[i].addEventListener("click", () => {
      toggleInfo(expend_btns[i].id.replace("_link", "")); // Expand or collapse the associated section
    });
  }

  // Add event listener to the menu toggle button for mobile navigation
  document.querySelector(".menu-toggle").addEventListener("click", () => {
    document.querySelector(".nav-menu").classList.toggle("active"); // Toggle the "active" class to show/hide the menu
  });
});

/**
 * Function to display and handle the contact popup.
 */
function togglePopup() {
  const popupOverlay = document.getElementById("popupOverlay"); // Popup overlay element
  const closePopupButton = document.getElementById("closePopup"); // Close button in the popup

  // Open the popup by setting its display to "flex"
  popupOverlay.style.display = "flex";

  // Add event listener to close the popup when the close button is clicked
  closePopupButton.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });

  // Optional: Close the popup when clicking outside the popup content
  popupOverlay.addEventListener("click", (event) => {
    if (event.target === popupOverlay) {
      popupOverlay.style.display = "none";
    }
  });
}

/**
 * Function to toggle the visibility of expandable content sections.
 * @param {string} section - The ID of the section to toggle.
 */
function toggleInfo(section) {
  const textElement = document.getElementById(`${section}_text`); // The main text element
  const linkElement = document.getElementById(`${section}_link`); // The "Learn More" / "Show Less" link element

  // Toggle the expanded state and update the content dynamically
  if (textElement.classList.contains("expanded")) {
    textElement.classList.remove("expanded"); // Collapse the content
    linkElement.textContent = i18next.t("learn_more"); // Update link text to "Learn More"
    textElement.innerHTML = i18next.t(`${section}_text`); // Display the short version of the content
  } else {
    textElement.classList.add("expanded"); // Expand the content
    linkElement.textContent = i18next.t("show_less"); // Update link text to "Show Less"
    textElement.innerHTML = `
          ${i18next.t(`${section}_text`)} 
          <br> 
          ${i18next.t(`${section}_details`)} 
      `; // Display the detailed content
  }
}
