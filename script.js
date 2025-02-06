// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqMZSidK10D7_fUit1uzDk1tkg60KS6js",
  authDomain: "hardywebsite-22e1a.firebaseapp.com",
  projectId: "hardywebsite-22e1a",
  storageBucket: "hardywebsite-22e1a.firebasestorage.app",
  messagingSenderId: "330508278612",
  appId: "1:330508278612:web:276bdb342bd7b2aa8606c1"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

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

  try {
    // Save the wish to Firestore
    await db.collection("wishes").add({
      name: name,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Refresh the wish wall by reloading all wishes
    await fetchWishes();

    // Clear input fields
    document.getElementById("name").value = "";
    document.getElementById("message").value = "";
  } catch (error) {
    console.error("Error saving wish:", error);
  }
}

// Function to fetch and load all wishes from Firestore
async function fetchWishes() {
  const wishWall = document.getElementById("wishWall");
  wishWall.innerHTML = ""; // Clear the wall

  try {
    const snapshot = await db.collection("wishes").orderBy("timestamp", "desc").get();
    snapshot.forEach(doc => {
      const wish = doc.data();
      const newNote = document.createElement("div");
      newNote.classList.add("sticky-note");
      newNote.style.setProperty("--rotation", `${Math.random() * 10 - 5}deg`);
      newNote.innerHTML = `
        <strong>${wish.name}</strong><br>${wish.message}
      `;

      // Append the sticky note to the wish wall
      wishWall.appendChild(newNote);
    });
  } catch (error) {
    console.error("Error fetching wishes from Firestore:", error);
  }
}

// Load wishes when the page is loaded
window.onload = fetchWishes;

// Attach the function to the form submission event
const wishForm = document.getElementById("wishForm");
wishForm.addEventListener("submit", addWish);
