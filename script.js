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

  // Save the wish to the server (this part is optional)
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

  // Refresh the wish wall by reloading all wishes from localStorage
  await fetchWishes();

  // Clear input fields
  document.getElementById("name").value = "";
  document.getElementById("message").value = "";
}

// Function to fetch and load all wishes from localStorage (instead of server)
async function fetchWishes() {
  const wishWall = document.getElementById("wishWall");
  wishWall.innerHTML = ""; // Clear the wall

  // Load wishes from localStorage
  const wishes = JSON.parse(localStorage.getItem("wishes")) || [];

  wishes.forEach((wish) => {
    const newNote = document.createElement("div");
    newNote.classList.add("sticky-note");
    newNote.style.setProperty("--rotation", `${Math.random() * 10 - 5}deg`);
    newNote.innerHTML = `
      <strong>${wish.name}</strong><br>${wish.message}
      <button class="delete-btn" onclick="deleteWishFromStorage('${wish.name}', '${wish.message}')">❌</button>
    `;
    
    // Append the sticky note to the wish wall
    wishWall.appendChild(newNote);
  });
}

// Function to save the wish to localStorage
function saveWishToStorage(name, message) {
  const wishes = JSON.parse(localStorage.getItem("wishes")) || [];
  wishes.push({ name, message });
  localStorage.setItem("wishes", JSON.stringify(wishes));
}

// Function to remove a wish from localStorage
function deleteWishFromStorage(name, message) {
  const wishes = JSON.parse(localStorage.getItem("wishes")) || [];
  const updatedWishes = wishes.filter(
    (wish) => !(wish.name === name && wish.message === message)
  );
  localStorage.setItem("wishes", JSON.stringify(updatedWishes));

  // Refresh the wish wall after deletion
  fetchWishes();
}

// Load wishes when the page is loaded
window.onload = fetchWishes;

// Attach the function to the form submission event
const wishForm = document.getElementById("wishForm");
wishForm.addEventListener("submit", addWish);
