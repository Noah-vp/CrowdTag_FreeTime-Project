/**
 * JavaScript code for smooth scrolling to specific sections on the landing page.
 * This function allows smooth navigation to a target element while applying an offset
 * to account for fixed headers or other page elements.
 */

/**
 * Smoothly scrolls the page to the specified element's position.
 * @param {string} elementId - The ID of the target element to scroll to.
 */
function scrollToElement(elementId) {
  const element = document.getElementById(elementId); // Get the target element by its ID

  // Ensure the element exists before proceeding
  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  // Calculate the target position relative to the viewport and page
  const offset = 100; // Offset in pixels (e.g., to account for a fixed header)
  const elementPosition =
    element.getBoundingClientRect().top + window.pageYOffset; // Element's position relative to the page

  // Scroll to the target position with the offset applied
  window.scrollTo({
    top: elementPosition - offset, // Adjust position to include the offset
    behavior: "smooth", // Enable smooth scrolling animation
  });
}
