function doGet(e) {
    // Get the name of the HTML file to load.
    var page = e.parameter.page;
  
    // If no page is specified, load the default page.
    if (!page) {
      page = "index.html";
    }
  
    // Load the HTML file and return it to the user.
    var htmlOutput = HtmlService.createHtmlOutputFromFile(page);
    return htmlOutput;
  }
  