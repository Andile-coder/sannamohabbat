var { Pool } = require("pg");

var pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "root",
  port: 5432, // default PostgreSQL port
});

module.exports=pool