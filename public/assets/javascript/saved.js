// loading saved article html/page via jQuery
$(document).ready(function() {
  // scraped container that will hold all rendered articles 
  var scrapedContainer = $(".scraped-container");
  // event listeners for dynamically generated buttons for deleting, recalling, saving, and deleting notes
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);

  // loadPage starts the app when page loaded
  loadPage();

  // empty the scrapedContainer, AJAX request for saved headlines
  function loadPage() {
  
    scrapedContainer.empty();
    $.get("/api/headlines?saved=true").then(function(data) {
      // render headlines
      if (data && data.length) {
        loadArticles(data);
      }
      else {
        // or let know there is nothing new
        renderEmpty();
      }
    });
  }

  // function to append HTML with article data to the page
  // pass JSON array containing all available articles in our database
  function loadArticles(articles) {

    var articlePanels = [];
    // pass JSON article object to the createPanelfunction to make Panels of saved articles
    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    // Once we have all of the HTML for the articles stored in our articlePanels array,
    // append to the scrapedContainer
    scrapedContainer.append(articlePanels);
  }

   // function to take a single JSON object for a headline, it will construct
   // a jQuery element with the structured HTML for the articlePan  
  function createPanel(article) {
  
    var panel = $(
      [
        "<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        "<a class='article-link' target='_blank' href='" + article.url + "'>",
        article.headline,
        "</a>",
        "<a class='btn btn-danger delete'>",
        "Delete From Saved",
        "</a>",
        "<a class='btn btn-info notes'>Article Notes</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        article.summary,
        "</div>",
        "</div>"
      ].join("")
    );
    // attach the article's id to the jQuery element for use in identifying what 
    // article the user wants to remove or open notes in
    panel.data("_id", article._id);
    // return the panel
    return panel;
  }

  // function to let user know there is nothing new
  function renderEmpty() {

    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Sorry! Nothing saved today.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>Please look for another article.</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a href='/'>View Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    // bring alert to page
    scrapedContainer.append(emptyAlert);
  }

  // function t render note list items to notes model
  function renderNotesList(data) {
    // array of notes to render when complete
    // currentNote variable to temporarily store notes
    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {
      // no notes to display? let user know
      currentNote = ["<li class='list-group-item'>", "No saved notes yet, feel free to add!", "</li>"].join("");
      notesToRender.push(currentNote);
    }
    else {
      // loop through notes to allow bringing them to page
      for (var i = 0; i < data.notes.length; i++) {
        // Constructor li element for our noteText and delete button
        currentNote = $(
          [
            "<li class='list-group-item note'>",
            data.notes[i].noteText,
            "<button class='btn btn-danger note-delete'>x</button>",
            "</li>"
          ].join("")
        );
        // add note id on the delete button to allow delete option
        currentNote.children("button").data("_id", data.notes[i]._id);
        // add currentNote to notesToRender array in this function
        notesToRender.push(currentNote);
      }
    }
    // append notesToRender to note-container inside note model
    $(".note-container").append(notesToRender);
  }

  // function for deleting articles
  function handleArticleDelete() {
    // get id of the article to delete from panel element where delete button lives
    var articleToDelete = $(this).parents(".panel").data();
    // delete article
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {
      // run loadPage again to render saved articles
      if (data.ok) {
        loadPage();
      }
    });
  }

  // function to opening the notes model & display notes
  function handleArticleNotes() {
 
    // take id of the article to get notes from the panel element the delete button lives in
    var currentArticle = $(this).parents(".panel").data();
    // get any notes with this article id
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      // Construct HTML to add to notes model
      var modelText = [
        "<div class='container-fluid text-center'>",
        "<h4>Notes For Article: ",
        currentArticle._id,
        "</h4>",
        "<hr />",
        "<ul class='list-group note-container'>",
        "</ul>",
        "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
        "<button class='btn btn-success save'>Save Note</button>",
        "</div>"
      ].join("");
      // add formatted HTML to the note model
      bootbox.dialog({
        message: modelText,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
      // Add noteData and article to save button
      $(".btn.save").data("article", noteData);
      // rpopulate the note HTML inside the model
      renderNotesList(noteData);
    });
  }
  
  // function for user to save a new note for an article
  function handleNoteSave() {
    // temp variable to hold our Note, grab the note typed into the input box and trim 
    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();
    // format input, post to /api/notes route, send noteData
    if (newNote) {
      noteData = {
        _id: $(this).data("article")._id,
        noteText: newNote
      };
      $.post("/api/notes", noteData).then(function() {
        // close model when done
        bootbox.hideAll();
      });
    }
  }
  
  // function to delete notes
  function handleNoteDelete() {
    // set variable with id of the note we want to delete, store this data on the delete button
    var noteToDelete = $(this).data("_id");
    // DELETE request to /api/notes/ with the id of the note we're deleting as parameter
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      // hide the model when done
      bootbox.hideAll();
    });
  }
});
