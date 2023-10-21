function doGet(e) {
  const { page } = e.parameter;
  var template = HtmlService.createTemplateFromFile('Page'); // Template HTML for shared content

  const gc = page => HtmlService.createHtmlOutputFromFile('view/index').getContent();

  switch (page) {
    case 'index':
      template.mainContent = gc('view/index')
      break;

    case 'group':
    case 'pitch':
    case 'team':
      template.mainContent = gc('view/' + page + '/select') 
      break;

    default:
      template.mainContent = gc('view/error')
      break;
  }

  return template.evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
