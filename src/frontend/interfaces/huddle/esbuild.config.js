const fs = require('fs');

const UI_INFO = {
  title: 'Team Huddle',
}

const cssSite = fs.readFileSync('../../shared/site.css', 'utf8');
const cssData = fs.readFileSync('style.css', 'utf8');
const jsData = fs.readFileSync('main.js', 'utf8');
const htmlData = `
  <!DOCTYPE html>
    <html>
    <head>
        <base target="_top">
        <title>${UI_INFO.title}</title>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="./lib/google-mock.js"></script>
        <script>
            ${jsData}
        </script>
        <style>
            ${cssSite}
        </style>
        <style>
            ${cssData}
        </style>
    </head>
    <body>
      <h1>${UI_INFO.title}</h1>
      <article id="content">
        <section id="sec-select">
          <h2>Select your team ...</h2>
          <div id="selectors">
            <select id="gender-selector">
                <option value="" disabled selected>Select Gender</option>
            </select>
            <select id="level-selector">
                <option value="" disabled selected>Select Level</option>
            </select>
            <select id="team-selector">
                <option value="" disabled selected>Select Team</option>
            </select>
          </div>
        </section>
        <section id="sec-main"></section>
      </article>
    </body>
    </html>
  `;

  fs.writeFileSync('../../mock/teams.html', htmlData);

