// Import i18next
import i18next from "https://deno.land/x/i18next/index.js";

// Function to set a cookie
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

// Function to get a cookie value
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return value;
    }
  }
  return null;
}

// Load translations from JSON
fetch("static/template_extentions/text/main.json")
  .then((response) => response.json())
  .then((resources) => {
    // Check for saved language in cookies
    const savedLanguage = getCookie("language") || "en"; // Default to 'en' if no cookie is set

    document.getElementById("languageSwitch-img").src =
      savedLanguage === "nl"
        ? "https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg"
        : "https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg";

    // Initialize i18next with fetched translations
    i18next.init(
      {
        lng: savedLanguage, // Use saved language or default
        debug: true, // Enables console logging for debugging
        resources, // Use loaded resources
      },
      (err, t) => {
        if (err) return console.error(err);
        updateContent(); // Load initial content
      }
    );
  })
  .catch((error) => console.error("Failed to load translations:", error));

// Function to update content
function updateContent() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = i18next.t(element.dataset.i18n);
  });
}

// Change language when the button is clicked
document.getElementById("languageSwitch").addEventListener("click", () => {
  const currentLang = i18next.language;
  const newLang = currentLang === "en" ? "nl" : "en";

  // Update the flag icon
  document.getElementById("languageSwitch-img").src =
    newLang === "nl"
      ? "https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg"
      : "https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg";

  // Change the language and save it in cookies
  i18next.changeLanguage(newLang, () => {
    updateContent();
    setCookie("language", newLang, 30); // Save the new language in a cookie for 30 days
  });
});

// Attach event listeners to buttons
var expend_btns = document.getElementsByClassName("learn-more-btn");
for (let i = 0; i < expend_btns.length; i++) {
  expend_btns[i].addEventListener("click", () => {
    toggleInfo(expend_btns[i].id.replace("_link", ""));
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const contact_btns = document.getElementsByClassName("contact-btn");
  for (let i = 0; i < contact_btns.length; i++) {
    contact_btns[i].addEventListener("click", (event) => {
      event.preventDefault();
      togglePopup();
    });
  }
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active"); // Toggle the active class
  });
});

function togglePopup() {
  const popupOverlay = document.getElementById("popupOverlay");
  const closePopupButton = document.getElementById("closePopup");

  // Open popup
  popupOverlay.style.display = "flex";
  // Close popup
  closePopupButton.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });

  // Optional: Close when clicking outside the popup
  popupOverlay.addEventListener("click", (event) => {
    if (event.target === popupOverlay) {
      popupOverlay.style.display = "none";
    }
  });
}

// Function to toggle expandable content
function toggleInfo(section) {
  const textElement = document.getElementById(`${section}_text`);
  const linkElement = document.getElementById(`${section}_link`);

  // Toggle the expandable text
  if (textElement.classList.contains("expanded")) {
    textElement.classList.remove("expanded");
    linkElement.textContent = i18next.t("learn_more"); // Fetch "Learn More" text
    textElement.innerHTML = i18next.t(`${section}_text`); // Fetch the short version from i18next
  } else {
    textElement.classList.add("expanded");
    linkElement.textContent = i18next.t("show_less"); // Fetch "Show Less" text
    textElement.innerHTML = `
          ${i18next.t(`${section}_text`)}
          <br>
          ${i18next.t(`${section}_details`)} 
      `; // Fetch the detailed text from i18next
  }
}
