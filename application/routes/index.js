var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log("hello")
  res.render("index", { title: "CSC 317 App", name: "Sanna Mohabbat" });
});

// //MAYBE CHANGE IF NOT WORKING
router.get("/login", function (req, res) {
  res.render("login");
});

router.get("/registration", function (req, res) {
  res.render("registration");
});

router.get("/postvideo", function (req, res) {
  res.render("postvideo");
});

router.get("/profile", function (req, res) {
  res.render("profile");
});

//maybe adjust
router.get("/postview", function (req, res) {
  res.render("viewpost");
});
module.exports = router;
