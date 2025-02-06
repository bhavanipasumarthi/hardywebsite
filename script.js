// Function to add a new wish
async function addWish(event) {
  event.preventDefault(); // Prevent form submission refresh

  // Get input values
  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !message) {
    alert("Both fields are required!");
    return;
  }

  // Save the wish to the server
  try {
    await fetch("/api/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });
  } catch (error) {
    console.error("Error saving wish to the server:", error);
  }

  // Save the wish to localStorage as a backup
  saveWishToStorage(name, message);

  // Refresh the wish wall by reloading all wishes
  await fetchWishes();

  // Clear input fields
  document.getElementById("name").value = "";
  document.getElementById("message").value = "";
}

// Function to fetch and load all wishes from the server
async function fetchWishes() {
  const wishWall = document.getElementById("wishWall");
  wishWall.innerHTML = ""; // Clear the wall

  try {
    const response = await fetch("/api/wishes");
    const wishes = await response.json();

    wishes.forEach((wish) => {
      const newNote = document.createElement("div");
      newNote.classList.add("sticky-note");
      newNote.style.setProperty("--rotation", `${Math.random() * 10 - 5}deg`);
      newNote.innerHTML = `
       <strong>${wish.name}</strong><br>${wish.message}
  
      `;

      // Add delete functionality
      //const deleteButton = newNote.querySelector(".delete-btn");
      //deleteButton.addEventListener("click", async () => {
      //wishWall.removeChild(newNote); // Remove the sticky note
      //await deleteWishFromServer(wish.name, wish.message); // Remove the wish from the server
      //deleteWishFromStorage(wish.name, wish.message); // Remove the wish from localStorage
      //});

      // Append the sticky note to the wish wall
      wishWall.appendChild(newNote);
    });
  } catch (error) {
    console.error("Error fetching wishes from the server:", error);

    // Load from localStorage if server fetch fails
    loadWishesFromStorage();
  }
}

// Function to save the wish to localStorage
function saveWishToStorage(name, message) {
  const wishes = JSON.parse(localStorage.getItem("wishes")) || [];
  wishes.push({ name, message });
  localStorage.setItem("wishes", JSON.stringify(wishes));
}

// Function to remove a wish from the server
async function deleteWishFromServer(name, message) {
  try {
    await fetch("/api/wishes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });
  } catch (error) {
    console.error("Error deleting wish from the server:", error);
  }
}

// Function to remove a wish from localStorage
function deleteWishFromStorage(name, message) {
  const wishes = JSON.parse(localStorage.getItem("wishes")) || [];
  const updatedWishes = wishes.filter(
    (wish) => !(wish.name === name && wish.message === message),
  );
  localStorage.setItem("wishes", JSON.stringify(updatedWishes));
}

// Function to load all wishes from localStorage
function loadWishesFromStorage() {
  const wishWall = document.getElementById("wishWall");
  const wishes = JSON.parse(localStorage.getItem("wishes")) || [];
  wishes.forEach((wish) => {
    const newNote = document.createElement("div");
    newNote.classList.add("sticky-note");
    newNote.style.setProperty("--rotation", `${Math.random() * 10 - 5}deg`);
    newNote.innerHTML = `
      <strong>${wish.name}</strong><br>${wish.message}
      <button class="delete-btn">❌</button>
    `;

    // Add delete functionality
    const deleteButton = newNote.querySelector(".delete-btn");
    deleteButton.addEventListener("click", () => {
      wishWall.removeChild(newNote); // Remove the sticky note from the page
      deleteWishFromStorage(wish.name, wish.message); // Remove the wish from localStorage
    });

    // Append the sticky note to the wish wall
    wishWall.appendChild(newNote);
  });
}

// Load wishes when the page is loaded
window.onload = fetchWishes;

// Attach the function to the form submission event
const wishForm = document.getElementById("wishForm");
wishForm.addEventListener("submit", addWish);
