const fs = require('fs');
const renderWebPage = ({
    title,
    files
}) => {
    const { css = [], js = [], html = [] } = files;
    const htmlData = `
      <!DOCTYPE html>
        <html>
        <head>
            <base target="_top">
            <title>${title}</title>
            <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
            <script src="./lib/google-mock.js"></script>
            ${js.map(c => {
                return `<script>${fs.readFileSync(c, 'utf8')}</script>`
            }).join('')}
            <style>
                ${css.map(c => {
                    return fs.readFileSync(c, 'utf8')
                }).join('\n\n\n')}
            </style>
        </head>
        <body>
          <h1>${title}</h1>
          <article id="content">
            ${html.map(c => {
                return fs.readFileSync(c, 'utf8')
            }).join('')}
          </article>
        </body>
        </html>
      `;
    
      fs.writeFileSync('../../mock/teams.html', htmlData);
}

module.exports = {
    renderWebPage,
}

