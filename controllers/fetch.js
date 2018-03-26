// Controller for scraper
// ============================
var db = require("../models");
var scrape = require("../scripts/scrape");

module.exports = {
  scrapeHeadlines: function(req, res) {
    // scrape New York Times
    return scrape()
      .then(function(articles) {
        // then insert into db
        return db.Headline.create(articles);
      })
      .then(function(dbHeadline) {
        if (dbHeadline.length === 0) {
          res.json({
            message: "Nothing for now. Check back later."
          });
        }
        else {
          // Otherwise send back article count
          res.json({
            message: "Found " + dbHeadline.length + " new articles."
          });
        }
      })
      .catch(function(err) {
        // No duplicate headlines, throw error if needed
        res.json({
          message: "Daily Scrape inbound..."
        });
      });
  }
};
