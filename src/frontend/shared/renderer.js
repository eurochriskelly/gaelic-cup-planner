const fs = require('fs');
const { execSync } = require('child_process');

const renderWebPage = ({
    title,
    files,
    outputHtml = '/tmp/index.html'
}) => {
    II('Convert JSX to JS.')
    execSync(['npx babel src --out-dir dist'].join(';'));

    // 
    II('Render web page.')
    const { css = [], js = [], html = [] } = files;
    const htmlData = `
      <!DOCTYPE html>
        <html>
        <head>
            <base target="_top">
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
            <script src="./lib/google-mock.js"></script>
            ${js.map(c => {
                return `<script>${fs.readFileSync(c, 'utf8')}</script>`
            }).join('')}
            <style>
                ${css.map(c => fs.readFileSync(c, 'utf8')).join('\n\n\n')}
            </style>
        </head>
        <body>
          <h1>${title}</h1>
          <article id="content">
            ${html.map(c => fs.readFileSync(c, 'utf8')).join('')}
          </article>
        </body>
        </html>
      `;
      fs.writeFileSync(outputHtml, htmlData);
};

const watchFiles = (title, files) => {
    II('Watching files.')
    const allFiles = [...files.css, ...files.js, ...files.html];
    allFiles.forEach(file => {
        fs.watch(file, (eventType, filename) => {
            if (fs.existsSync(file) === false) {
                console.log(`File [$file] not found. Skipping ...`)
                return
            }
            if (eventType === 'change') {
                console.log(` ... ${file} has been changed. Re-rendering...`);
                renderWebPage({ title, files });
            }
        });
    });
}

const II = msg => {
    console.log(`II ${msg}`);
}

module.exports = {
    renderWebPage,
    watchFiles
};
