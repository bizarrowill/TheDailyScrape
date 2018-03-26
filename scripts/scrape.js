// Require axios, cheerio - enables scrape
var axios = require("axios");
var cheerio = require("cheerio");

// function for scraping the NYTimes 
var scrape = function() {
  // scrape NYTimes site
  return axios.get("http://www.nytimes.com").then(function(res) {
    var $ = cheerio.load(res.data);
    // Make an empty array to save our article info
    var articles = [];

    // find and loop through each element with class  ".theme-summary" // the section holding the articles
    $(".theme-summary").each(function(i, element) {
      // In each .theme-summary, we grab the child with the class story-heading

      // grab the inner text of the this element => store head variable
      // this is the article headline
      var heading = $(this)
        .children(".story-heading")
        .text()
        .trim();

      // assign the URL of the article to url variable
      var url = $(this)
        .children(".story-heading")
        .children("a")
        .attr("href");

      // assign inner text of children with class '.summary' => sum // this will be article summary
      var summary = $(this)
        .children(".summary")
        .text()
        .trim();

      // if headline and sum and url aren't empty/undefined, take these actions
      if (heading && summary && url) {
        // clean up results with .trim and regular expressions
        var headNeat = heading.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = summary.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        // initialize object for pushing to the articles array

        var savedArticles = {
          headline: headNeat,
          summary: sumNeat,
          url: url
        };

        articles.push(savedArticles);
      }
    });
    return articles;
  });
};

// Export the function for other files to access
module.exports = scrape;
