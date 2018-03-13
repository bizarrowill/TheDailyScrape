// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = mongojs(databaseUrl, collections);;

// Routes -- these routes from notes mongodb app
// =============================================================
module.exports = function(app) {

    // Routes from notes app excercise
    // Simple index route
    app.get("/", function(req, res) {
      res.send(index.html);
    });

    // Handle form submission, save submission to mongo
    app.post("/submit", function(req, res) {
      console.log(req.body);
      // Insert the note into the notes collection
      db.notes.insert(req.body, function(error, saved) {
        // Log any errors
        if (error) {
          console.log(error);
        }
        else {
          // Otherwise, send the note back to the browser
          // This will fire off the success function of the ajax request
          res.send(saved);
        }
      });
    });

    // Retrieve results from mongo
    app.get("/all", function(req, res) {
      // Find all notes in the notes collection
      db.notes.find({}, function(error, found) {
        // Log any errors
        if (error) {
          console.log(error);
        }
        else {
          // Otherwise, send json of the notes back to user
          // This will fire off the success function of the ajax request
          res.json(found);
        }
      });
    });

    // Select just one note by an id
    app.get("/find/:id", function(req, res) {
      // When searching by an id, the id needs to be passed in
      // as (mongojs.ObjectId(IDYOUWANTTOFIND))

      // Find just one result in the notes collection
      db.notes.findOne(
        {
          // Using the id in the url
          _id: mongojs.ObjectId(req.params.id)
        },
        function(error, found) {
          // log any errors
          if (error) {
            console.log(error);
            res.send(error);
          }
          else {
            // Otherwise, send the note to the browser
            // This will fire off the success function of the ajax request
            console.log(found);
            res.send(found);
          }
        }
      );
    });

    // Update just one note by an id
    app.post("/update/:id", function(req, res) {
      // When searching by an id, the id needs to be passed in
      // as (mongojs.ObjectId(IDYOUWANTTOFIND))

      // Update the note that matches the object id
      db.notes.update(
        {
          _id: mongojs.ObjectId(req.params.id)
        },
        {
          // Set the title, note and modified parameters
          // sent in the req's body.
          $set: {
            title: req.body.title,
            note: req.body.note,
            modified: Date.now()
          }
        },
        function(error, edited) {
          // Log any errors from mongojs
          if (error) {
            console.log(error);
            res.send(error);
          }
          else {
            // Otherwise, send the mongojs response to the browser
            // This will fire off the success function of the ajax request
            console.log(edited);
            res.send(edited);
          }
        }
      );
    });

    // Delete One from the DB
    app.get("/delete/:id", function(req, res) {
      // Remove a note using the objectID
      db.notes.remove(
        {
          _id: mongojs.ObjectID(req.params.id)
        },
        function(error, removed) {
          // Log any errors from mongojs
          if (error) {
            console.log(error);
            res.send(error);
          }
          else {
            // Otherwise, send the mongojs response to the browser
            // This will fire off the success function of the ajax request
            console.log(removed);
            res.send(removed);
          }
        }
      );
    });

    // Clear the DB
    app.get("/clearall", function(req, res) {
      // Remove every note from the notes collection
      db.notes.remove({}, function(error, response) {
        // Log any errors to the console
        if (error) {
          console.log(error);
          res.send(error);
        }
        else {
          // Otherwise, send the mongojs response to the browser
          // This will fire off the success function of the ajax request
          console.log(response);
          res.send(response);
        }
      });
    });
  };