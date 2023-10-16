# Getting started

This guide is to help contributing developers to extend the
functionality of this tool.

While it's possible to copy the source files into a new Google App
Script application, the recommended way to contribute is by using
google clasp.

1. Clone this repository.
2. Install google clasp
   - `npm install -g @google/clasp`
2. Create a new google sheet for storing the data.
3. Create an App Script from the sheet
   - Go to Extensions -> App Scripts.
   - Grant any requested permissions
4. Copy the id of the Google App Script from the browser.
5. Clone the google app
   - Run `clasp clone <ID_COPIED_FROM_APP_SCRIPT>`
6. Push the current app
   - Run `clasp push`

Happy coding!
