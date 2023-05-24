var express = require("express");
var router = express.Router();
const fs = require('fs');
const jwt = require("jsonwebtoken");
const { use } = require("../app");
// Create a new pool instance
const pool=require('./connector')

router.use(express.json());

router.get("/")
router.get("/blogs", async (req, res) => { 
  try {
    // Retrieve the user data based on the authenticated user ID
    const query = "SELECT * FROM blog_posts ";
    const result = await pool.query(query);
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
router.post('/')
router.post("/",authenticateToken ,async (req, res) => { 
    try {
      // Retrieve the user data based on the authenticated user ID
      const userId=req.user.userId
      const {file,title,content,thumbnail}=req.body

      // console.log(thumbnail)
      const thumbnailBuffer = fs.readFileSync('routes/flutter.png');
      
      const query = "INSERT INTO blog_posts (title, content,author_id,thumbnail) VALUES ($1, $2,$3,$4)";
      const values=[title,content,`${userId}`,thumbnail]
      const result = await pool.query(query,values);
      return res.json({ message: "Post uploaded successfully" });
      
    } catch (err) {
      console.error("Error retrieving user data", err);
      return `Internal Server Error ${err}`
    }
  });

router.delete('/')
router.delete("/:id",authenticateToken ,async (req, res) => { 
  
      try {
        // Retrieve the user data based on the authenticated user ID
        const userId=req.user.userId
        const postId = req.params.id;

      
        const commentsQuery= `DELETE FROM comments WHERE blog_id= ${postId}`
        const deleteReslts=  await pool.query(commentsQuery);
        const query =  "DELETE FROM blog_posts WHERE id = $1 AND author_id = $2";
        const values=[postId,userId]
        const result = await pool.query(query,values);
        return res.json({ message: "Post deleted successfully" });
        
      } catch (err) {
        console.error("Error retrieving user data", err);
        return `Internal Server Error ${err}`
      }
    });


module.exports = router;
