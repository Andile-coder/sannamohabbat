var { Pool } = require("pg");
var express = require("express");
var router = express.Router();
const fs = require('fs');
const auth=require("./authenticate")

// Create a new pool instance
var pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "root",
  port: 5432, // default PostgreSQL port
});

router.use(express.json());

  
router.get("/my",authenticateToken, async (req, res) => { 
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
router.get("/", async (req, res) => { 
  try {
    // Retrieve the user data based on the authenticated user ID
    const query = "SELECT * FROM blog_posts";
    const result = await pool.query(query);
    const posts = result.rows;
    // Return the user data
    return res.json({ posts });
  } catch (err) {
    console.error("Error retrieving user data", err);
    return "Internal Server Error"
  }
});


router.post("/", async (req, res) => { 
    try {
      // Retrieve the user data based on the authenticated user ID
      const {file,title,content,thumbnail}=req.body
      console.log("body",req.body)
      const thumbnailBuffer = fs.readFileSync('routes/flutter.png');
      const query = "INSERT INTO blog_posts (title, content,author_id,thumbnail) VALUES ($1, $2,$3,$4)";
      const values=[title,"helloworld","2",thumbnail]
      const result = await pool.query(query,values);
      return res.json({ message: "Post uploaded successfully" });
      
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
