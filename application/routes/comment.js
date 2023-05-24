var { Pool } = require("pg");
var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create a new pool instance
const pool=require('./connector')

router.use(express.json());


router.get("/", async (req, res) => {
  try {
    // Retrieve the user data based on the authenticated user ID
    const query = "SELECT * FROM comments";
    const result = await pool.query(query);
    const user = result.rows[0];
    if (!user) {
      return [];
      
    }
    // Return the user data
    return res.json({ user });
  } catch (err) {
    console.error("Error retrieving comment data", err);
    return "Internal Server Error"
  }
});

router.post("/:id",authenticateToken ,async (req, res) => { 
  try {
    // Retrieve the user data based on the authenticated user ID
    const userId=req.user.userId
    const postId=req.params.id
    const textContent=req.body.comment

   console.log(textContent)

  
    const query = `insert into comments (user_id,blog_id,content) values(${userId},${postId},'${textContent}');`;
    
    const result = await pool.query(query);
    return res.json({ message: "Comment uploaded successfully" });
    
  } catch (err) {
    console.error("Error retrieving user data", err);
    return `Internal Server Error ${err}`
  }
});
router.get("/:id",authenticateToken ,async (req, res) => { 
  try {
    // Retrieve the user data based on the authenticated user ID
    const userId=req.user.userId
    const postId=req.params.id
  
    const query = `SELECT * FROM comments WHERE blog_id=$1;`;
    
    const result = await pool.query(query,[postId]);
    const comment = result.rows
   return res.json({ comment });
    
  } catch (err) {
    console.error("Error retrieving user data", err);
    return `Internal Server Error ${err}`
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
