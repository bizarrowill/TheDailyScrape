// Controller for our notes
// ========================
var db = require("../models");

module.exports = {
  // Find one note
  findOne: function(req, res) {
    db.Note
      .findOne(req.query)
      .then(function(dbNote) {
        res.json(dbNote);
    });
  },
  // Create a new note
  create: function(req, res) {
    db.Note
      .create(req.body)
      .then(function(dbNote) {
        res.json(dbNote);
    });
  },
  // Delete a note with a given id
  delete: function(req, res) {
    db.Note
      .remove({ _id: req.params.id })
      .then(function(dbNote) {
        res.json(dbNote);
    });
  }
};
