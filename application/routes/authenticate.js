var { Pool } = require("pg");
var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/* GET users listing. */

// Create a new pool instance
var pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "root",
  port: 5432, // default PostgreSQL port
});
router.use(express.json());

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = "SELECT * FROM users WHERE username = $1";
    const result = await pool.query(query, [username]);
    const user = result.rows[0];

    if (!user) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, "your_secret_key");
    res.json({ token });
  } catch (err) {
    console.error("Error logging in", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// create user
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);

  try {
    // Check if the username already exists in the database
    const checkQuery = "SELECT * FROM users WHERE username = $1";
    const checkResult = await pool.query(checkQuery, [username]);
    const existingUser = checkResult.rows[0];

    if (existingUser) {
      res.status(409).json({ error: "Username already exists" });
      return;
    }

    // Hash the password and insert the new user into the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery =
      "INSERT INTO users (username, email,password) VALUES ($1, $2,$3)";
    const values = [username, email, hashedPassword];

    await pool.query(insertQuery, values);
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/logout", (req, res) => {
  // Clear the token from client-side storage (e.g., local storage, cookies)
  // Adjust the code based on how you store the token
  // For example, if you use JWT in a client-side cookie, you can delete the cookie
  res.clearCookie("token");

  // Optionally, invalidate the token on the server-side
  // Store the invalidated token in a blacklist or perform any necessary cleanup

  res.json({ message: "Logout successful" });
});
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log(authHeader, "-----------------");
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
// module.exports = authenticateToken