/**
 * JavaScript code for managing multi-language support across all HTML files.
 * This script uses i18next for dynamic translations, updates text and placeholders based on the selected language,
 * and saves the user's language preference in a cookie for persistent settings.
 */

// Import i18next for internationalization
import i18next from "https://deno.land/x/i18next/index.js";

/**
 * Function to set a cookie with a specified name, value, and expiration time in days.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value to store in the cookie.
 * @param {number} days - The number of days until the cookie expires.
 */
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Calculate expiration time
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`; // Set the cookie
}

/**
 * Function to retrieve the value of a cookie by name.
 * @param {string} name - The name of the cookie.
 * @returns {string|null} - The value of the cookie, or null if not found.
 */
function getCookie(name) {
  const cookies = document.cookie.split("; "); // Split cookies into individual entries
  for (const cookie of cookies) {
    const [key, value] = cookie.split("="); // Split name and value
    if (key === name) {
      return value; // Return the matching cookie's value
    }
  }
  return null; // Return null if no match is found
}

// Fetch the translations from the JSON file
fetch("static/template_extentions/text/main.json")
  .then((response) => response.json())
  .then((resources) => {
    // Retrieve the saved language from cookies or default to English ('en')
    const savedLanguage = getCookie("language") || "en";

    // Update the language switch button's flag image
    document.getElementById("languageSwitch-img").src =
      savedLanguage === "nl"
        ? "https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg" // UK flag
        : "https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg"; // Netherlands flag

    // Initialize i18next with the translations and saved language
    i18next.init(
      {
        lng: savedLanguage, // Set the initial language
        debug: false, // Disable debug logging
        resources, // Use the fetched translation resources
      },
      (err, t) => {
        if (err) return console.error(err); // Log errors if initialization fails
        updateContent(); // Update page content with translations
      }
    );
  })
  .catch((error) => console.error("Failed to load translations:", error)); // Handle JSON load errors

/**
 * Function to update the text content and placeholders of elements with translations.
 */
function updateContent() {
  // Update text content for elements with a `data-i18n` attribute
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n; // Get the translation key
    const params = JSON.parse(element.dataset.i18nParams || "{}"); // Parse dynamic parameters
    element.textContent = i18next.t(key, params); // Translate and update the content
  });

  // Update placeholder attributes for elements with a `data-i18n-placeholder` attribute
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder; // Get the placeholder key
    const params = JSON.parse(element.dataset.i18nParams || "{}"); // Parse dynamic parameters
    element.setAttribute("placeholder", i18next.t(key, params)); // Translate and update the placeholder
  });
}

// Add a click event listener to the language switch button
document.getElementById("languageSwitch").addEventListener("click", () => {
  const currentLang = i18next.language; // Get the current language
  const newLang = currentLang === "en" ? "nl" : "en"; // Toggle between English and Dutch

  // Update the language switch button's flag image
  document.getElementById("languageSwitch-img").src =
    newLang === "nl"
      ? "https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg" // UK flag
      : "https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg"; // Netherlands flag

  // Change the language in i18next and update the content
  i18next.changeLanguage(newLang, () => {
    updateContent(); // Refresh content with the new language
    setCookie("language", newLang, 30); // Save the selected language in a cookie (expires in 30 days)
  });
});
