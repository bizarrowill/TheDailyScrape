// load router
var router = require("express").Router();

// renders homepage
router.get("/", function(req, res) {
  res.render("home");
});

// renders the saved handledbars 
router.get("/saved", function(req, res) {
  res.render("saved");
});

module.exports = router;
