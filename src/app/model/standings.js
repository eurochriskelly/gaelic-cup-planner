
function updateStandings(data) {
  if (!data) {
    Logger.log('This is a library. Do not run directly!')
    return
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Standings");
  sheet.clearContents()
  
  // Clear the sheet
  clearAllFormatting();
  
  sheet.appendRow([`STANDINGS @ ${new Date().toLocaleString()}`]);
  
  // Create the headers
  var headers = Object.keys(data[0]);

  const groupList = {};
  data.forEach(d => groupList[d.group] = true);
  const groups = Object.keys(groupList);

  sheet.getRange(1, 1, 1, headers.length + 3)
    .setBackground("red")
    .setFontColor("white")
    .setFontSize(26)

  // Initialize the current row to 1 (first row)
  var currentRow = 2

  groups.forEach(group => {
    // Set the group row background and font color
    sheet.getRange(currentRow, 2, 1, headers.length).setBackground("gray").setFontColor("white");
    sheet.appendRow([' ', 'GROUP', '', group.split('')
      .map(x => {
        switch(x) {
          case 'L': return 'Ladies'
          case 'M': return 'Mens'
          case 'I': return 'intermediate group'
          case 'J': return 'junior group'
          case 'S': return 'senior group'
          default : return x
        }
      }).join(' ')
    ]);
    currentRow++;

    // Set the header row background and font color
    sheet.getRange(currentRow, 2, 1, headers.length).setBackground("blue").setFontColor("white");
    sheet.appendRow([' ', ...headers]);
    currentRow++;

    // Append the data
    data
      .filter(d => d.group == group)
      .forEach(d => {
        var row = Object.values(d);
        Logger.log(row)
        sheet.appendRow([' ', ...row]);
        currentRow++;
      });

    // Add a separator row
    sheet.appendRow([' ']);
    currentRow++;
  });
}


function clearAllFormatting() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Standings"); // replace with your sheet's name
  var range = sheet.getRange("A1:Z1000"); // adjust the range as necessary
  
  range.clearFormat();
}

