// require dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");

// Set up our port for production or local environment
var PORT = process.env.PORT || 3000;

// initialize our express 
var app = express();

// require routes
var routes = require("./routes");

// set public folder as a static directory
app.use(express.static("public"));

// connect handlebars to express app - build off main
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// use bodyParser in our app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ensure all request go through route middleware
app.use(routes);

// If deployed, use the deployed database // therwise use the local theDailyScrape database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/theDailyScrape";

// use Mongoose to allow modern ES6
// By default mongoose uses callbacks for async queries, 
//we're setting it to use promises (.then syntax) 

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// Listen on the port
app.listen(PORT, function() {
  console.log("Listening on port: " + PORT);
});
