var { Pool } = require("pg");
var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create a new pool instance
const pool=require('./connector')

router.use(express.json());

router.get("/")
router.get("/profile", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
 
  try {
    // Retrieve the user data based on the authenticated user ID
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await pool.query(query, [userId]);
    const user = result.rows[0];

    if (!user) {
      return "User not found";
      
    }

    // Return the user data
    return res.json({ user });
  } catch (err) {
    console.error("Error retrieving user data", err);
    return "Internal Server Error"
  }
});
router.get("/")
router.get("/blogs",authenticateToken, async (req, res) => { 
  try {
    // Retrieve the user data based on the authenticated user ID
    const query = "SELECT * FROM blog_posts where author_id=$1";
    const result = await pool.query(query,[req.user.userId]);
    const posts = result.rows;
    // Return the user data
    return res.json({ posts });
  } catch (err) {
    console.error("Error retrieving user data", err);
    return "Internal Server Error"
  }
});
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
 
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
}
module.exports = router;
