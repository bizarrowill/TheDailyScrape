// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Configure Middleware
// Set the app up with morgan.
// morgan is used to log our HTTP Requests. By setting morgan to 'dev' 
// the :status token will be colored red for server error codes, 
// yellow for client error codes, cyan for redirection codes, 
// and uncolored for all other codes.
app.use(logger("dev"));

// Setup the app with body-parser and a static folder
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

require('./public/js/handlebars.js')(exphbs);

//________________________________________________________________
//Direct us to where the handle bars gets pointed at 
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scrapedData", {
  useMongoClient: true
});


// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs config to db variable
var db = mongojs(databaseUrl, collections);

// Log any mongojs errors to console
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Routes
// ======


// Sync mongoose models and start listening express app

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
