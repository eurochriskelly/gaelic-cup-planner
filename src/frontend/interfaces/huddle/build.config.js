const { renderWebPage } = require('../../shared/renderer')

const UI_INFO = {
  title: 'Team Huddle',
  files: {
    css: [
      '../../shared/css/site.css',
      './style.css'
    ],
    js: [
      '../../shared/js/widgets.js',
      './main.js'

    ],
    html: [
      './sections/select.html',
      './sections/main.html',
      // './sections/testing.html',
    ]
  }
}

renderWebPage(UI_INFO);



