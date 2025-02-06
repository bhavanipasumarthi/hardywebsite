const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for wishes
let wishes = [];

// Get all wishes
app.get("/api/wishes", (req, res) => {
  res.json(wishes);
});

// Add a new wish
app.post("/api/wishes", (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: "Name and message are required." });
  }
  wishes.push({ name, message });
  res.status(201).json({ success: true });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
