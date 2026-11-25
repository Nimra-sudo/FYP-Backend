const express = require("express");
const User = require("../model/User");
const { verifyToken, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.post("/add-admin", verifyToken, adminOnly, async (req, res) => {
  try {
    const email = (req.body.email || "").trim();

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No registered user with this email." });
    }

    if (user.role === "admin") {
      return res.status(200).json({ message: "This user is already an admin." });
    }

    user.role = "admin";
    await user.save();

    res.status(200).json({ message: "Admin added successfully!" });
  } catch (error) {
    console.error("Add Admin Error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;