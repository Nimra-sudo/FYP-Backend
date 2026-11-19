const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Ye DNS wali lines sirf aap ke laptop par chalengi
if (!process.env.VERCEL) {
  const dns = require("dns");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const authRoutes = require("./Route/AuthRoute");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// Database connection (Vercel ke liye)
let connection = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  if (!connection) {
    connection = mongoose.connect(process.env.MONGO_URI);
  }
  await connection;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB Error:", error);
    connection = null;
    res.status(500).json({ message: "Database connection failed." });
  }
});

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Face Liveness Backend is Running!");
});

// Laptop par chalane ke liye
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
}

module.exports = app;