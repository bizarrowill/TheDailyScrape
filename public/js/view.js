$(document).ready(function() {
  
  // Our new stamps will go inside the stampContainer
  var $savedArticles = $(".article-container");
  // Adding event listeners for deleting, editing, and adding stamps
  $(document).on("click", "button", deleteArticle);
  $(document).on("keyup", ".class", finishEdit);
  $(document).on("blur", ".class", cancelEdit);
  $(document).on("submit", "#id", insertStamp);

  // Our initial articles array
  var savedArticles = [];

  // Getting articles from database when page loads
  getArticles();
});
