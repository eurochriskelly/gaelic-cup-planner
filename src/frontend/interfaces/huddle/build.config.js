const { renderWebPage, watchFiles } = require('../../shared/renderer')

const UI_INFO = {
  title: 'Team Huddle',
  files: {
    css: [
      '../../shared/css/site.css',
      './style.css'
    ],
    js: [
      '../../shared/js/widgets.js',
      './main.js',
      './sections/select/control.js',
      './sections/main/control.js',
    ],
    html: [
      './sections/select/view.html',
      './sections/main/view.html',
      // './sections/testing.html',
    ]
  }
}

renderWebPage(UI_INFO);
watchFiles(UI_INFO.title, UI_INFO.files);



