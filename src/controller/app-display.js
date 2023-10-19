function doGet() {
  return HtmlService.createHtmlOutputFromFile('view/index');
}

function loadPage(pageName) {
  return HtmlService.createHtmlOutputFromFile('view/' + pageName)
    .getContent();
}
