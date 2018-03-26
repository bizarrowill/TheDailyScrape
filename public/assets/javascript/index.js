// load main page
$(document).ready(function() {
  // set scraped-container div for all the dynamic content to go
  // add event listeners to 'saved articles' & 'scrape new article button'
  var scrapedContainer = $(".scraped-container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);

  // when page is ready, run the loadPage function 
  loadPage();

  function loadPage() {
    // empty article container, run an AJAX request for any unsaved headlines
    scrapedContainer.empty();
    $.get("/api/headlines?saved=false").then(function(data) {
      // If we have headlines, render them to the page
      if (data && data.length) {
        loadArticles(data);
      }
      else {
        // or render a message explaing we have no articles
        renderEmpty();
      }
    });
  }

  // function to handle appending HTML containing article data to the page
  function loadArticles(articles) {
    // pass an array of JSON containing all available articles in our database
    var articlePanels = [];
    // pass each article JSON object to createPanel function => bootstrap panel with our article data inside
    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    // Once we have all of the HTML for the articles stored in our articlePanels array,
    // append them to the articlePanels container
    scrapedContainer.append(articlePanels);
  }

  // function that takes in a single JSON object for headline
  function createPanel(article) {
   
    // constructs a jQuery element containing the formatted HTML for the article panel
    var panel = $(
      [
        "<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        "<a class='article-link' target='_blank' href='" + article.url + "'>",
        article.headline,
        "</a>",
        "<a class='btn btn-success save'>",
        "Save Article",
        "</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        article.summary,
        "</div>",
        "</div>"
      ].join("")
    );
    // attach the article's id to the jQuery element to identify article user wants to save
    panel.data("_id", article._id);
    // return the constructed panel jQuery element
    return panel;
  }

  // function to renders HTML re: no alrticles available
  function renderEmpty() {
    // here we chose joined array of HTML string data because it's easier to read/change 
    // than a concatenated string
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Sorry! We're currently fresh out of new headlines.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>What would you liek to do next?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a class='scrape-new'>Scape again!</a></h4>",
        "<h4><a href='/saved'>View Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    // append data to the page
    scrapedContainer.append(emptyAlert);
  }

  // function is triggered when the user saves an article
  function handleArticleSave() {
    // retrieve headline id we attatched a javascript object using .data method 
    var articleToSave = $(this)
      .parents(".panel")
      .data();
    articleToSave.saved = true;
    // use patch method to be semantic since this is an update to an existing record in our collection
    $.ajax({
      method: "PUT",
      url: "/api/headlines/" + articleToSave._id,
      data: articleToSave
    }).then(function(data) {
      // if data was saved successfully
      if (data.saved) {
        // run loadPage function again, will reload the entire list of articles
        loadPage();
      }
    });
  }

  // function to handle the user clicking any "scrape new article" buttons
  function handleArticleScrape() {
    
    $.get("/api/fetch").then(function(data) {
      // If we are able to succesfully scrape the NYTIMES and compare the articles to those
      // already in our collection, re render the articles on the page
      // and let the user know how many unique articles we were able to save
      loadPage();
      bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
    });
  }
});
