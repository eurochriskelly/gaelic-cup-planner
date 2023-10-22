const SS_ID = '1WlGoDODrMlLOn5ojY-gSpi7geCtJDQ01DzcbBwQQ734'

const gatherGroups = () => {
    var spreadsheet = SpreadsheetApp.openById(SS_ID);
    var sheet = spreadsheet.getSheetByName("teams");
    var data = sheet.getDataRange().getValues();
    
    var result = [
      'Mens junior',
      'Mens intermediate',
      'Mens senior',
      'Womens junior',
      'Womens intermediate',
      'Womens senior'
    ]
    
    /*
    for (var i = 1; i < data.length; i++) { // Start from 1 to skip the header row
      var pitch = data[i][0];
      var location = data[i][1];
      
      if (pitch && location) { // Check if both columns have values
        result.push({pitch, location});
      }
    }
    */
    
    return result;
}