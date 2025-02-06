// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqMZSidK10D7_fUit1uzDk1tkg60KS6js",
  authDomain: "hardywebsite-22e1a.firebaseapp.com",
  projectId: "hardywebsite-22e1a",
  storageBucket: "hardywebsite-22e1a.appspot.com",  // Corrected this line
  messagingSenderId: "330508278612",
  appId: "1:330508278612:web:276bdb342bd7b2aa8606c1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to add a new wish
async function addWish(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !message) {
    alert("Both fields are required!");
    return;
  }

  try {
    await db.collection("wishes").add({
      name: name,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    await fetchWishes();

    document.getElementById("name").value = "";
    document.getElementById("message").value = "";
  } catch (error) {
    console.error("Error saving wish:", error);
  }
}

// Function to fetch and display wishes
async function fetchWishes() {
  const wishWall = document.getElementById("wishWall");
  wishWall.innerHTML = "";

  try {
    const snapshot = await db.collection("wishes").orderBy("timestamp", "desc").get();
    snapshot.forEach(doc => {
      const wish = doc.data();
      const newNote = document.createElement("div");
      newNote.classList.add("sticky-note");
      newNote.innerHTML = `<strong>${wish.name}</strong><br>${wish.message}`;
      wishWall.appendChild(newNote);
    });
  } catch (error) {
    console.error("Error fetching wishes:", error);
  }
}

// Load wishes when the page is loaded
window.onload = fetchWishes;

// Attach the function to the form submission event
document.getElementById("wishForm").addEventListener("submit", addWish);
