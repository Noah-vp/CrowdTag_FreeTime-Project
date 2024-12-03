let container = document.getElementById("pictures");
let data = document.getElementById("data").innerHTML;
let dict = JSON.parse(data.replace(/'/g, '"'));
let active = Object.keys(dict);

// Iterate through each key in the dictionary to create buttons
for (let key in dict) {
  if (dict.hasOwnProperty(key)) {
    let button = document.createElement("button");
    button.textContent = "person " + key; // Set the button text to the key

    // Initially set the button class based on whether it's in the active array
    if (!active.includes(key)) {
      button.classList.add("non-selected");
    }

    // Add a click event handler for the button
    button.addEventListener("click", function () {
      if (!active.includes(key)) {
        active.push(key);
        button.classList.remove("non-selected");
      } else {
        let index = active.indexOf(key);
        if (index !== -1) {
          active.splice(index, 1); // Remove the key from the active array
        }
        button.classList.add("non-selected");
      }
      refresh(); // Refresh images after changing the active state
    });

    // Append the button to the container
    document.getElementById("buttons").appendChild(button);
  }
}

// Refresh function to update the displayed images based on active keys
function refresh() {
  // Clear existing images in the container
  container.innerHTML = "";

  // Iterate through the active keys and display the associated images
  active.forEach(function (key) {
    // Get the pictures for the current active key
    let pictures = dict[key];

    // Create image elements for each picture
    pictures.forEach(function (pictureUrl) {
      let img = document.createElement("img");
      img.src = pictureUrl; // Set the image source
      img.alt = `Picture for ${key}`; // Optional alt text for accessibility
      img.style.width = "100%"; // Set the image to take up the full width of the container
      img.style.margin = "5px 0"; // Optional margin to space the images vertically

      // Append each image to the container
      container.appendChild(img);
    });
  });
}

// Initial call to display the active pictures
refresh();
