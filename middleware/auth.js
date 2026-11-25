const jwt = require("jsonwebtoken");
const User = require("../model/User");

// Check karta hai ke user login hai (token sahi hai)
function verifyToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Login required." });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Session expired. Login again." });
  }
}

// Check karta hai ke user admin hai (database se dekh kar)
async function adminOnly(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
}

module.exports = { verifyToken, adminOnly };