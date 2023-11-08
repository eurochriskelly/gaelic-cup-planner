const getListOfPitches = () => {
    var spreadsheet = SpreadsheetApp.openById(SS_ID);
    var sheet = spreadsheet.getSheetByName("pitches");
    var data = sheet.getDataRange().getValues();
    
    const result = [];
    
    for (var i = 1; i < data.length; i++) { // Start from 1 to skip the header row
      const pitch = data[i][0];
      const location = data[i][1];
      const type = data[i][2] || 'grass'
      
      if (pitch && location) { // Check if both columns have values
        result.push({id: pitch, location, type});
      }
    }
    
    return result;
}

const getFixtures = (pitch, id) => {
    if (!pitch) return [];
    
    var spreadsheet = SpreadsheetApp.openById(SS_ID);
    var sheet = spreadsheet.getSheetByName("Fixtures");
    var rawData = sheet.getDataRange().getValues();
    var keys = rawData[0];
    
    var data = rawData.slice(1).map((row, index) => {
        var obj = { };
        keys.forEach((key, i) => {
            obj[key] = row[i];
        });
        return obj;
    });

    var result = data
        .filter(d => d.Stage === 'Group')
        .filter(d => d.Pitch === pitch)
        .map(d => {
            var scheduledTime = new Date(d.Scheduled);
            var formattedTime = `${scheduledTime.getUTCHours().toString().padStart(2, '0')}:${scheduledTime.getUTCMinutes().toString().padStart(2, '0')}`;
            return {
                ...d,
                Scheduled: formattedTime,
                Started: null,
                id: d.Name1 + d.Name2 + d.Scheduled + d.Pitch,
            };
        })
        .filter(d => !id || d.id === id);

    return result
}

const updateScore = (fixture, score) => {
    var spreadsheet = SpreadsheetApp.openById(SS_ID);
    var sheet = spreadsheet.getSheetByName("results");
    var rawData = sheet.getDataRange().getValues();
    var keys = rawData[0];
    var rowIndexToUpdate = -1;
    // Find the index of 'MID' column
    var midColumnIndex = keys.indexOf('MID');
    // Find the row index to update
    for (var i = 1; i < rawData.length; i++) {
        if (rawData[i][midColumnIndex] === fixture.MID) {
            rowIndexToUpdate = i;
            break;
        }
    }
    // If row found, update the score
    if (rowIndexToUpdate !== -1) {
        for (const [key, value] of Object.entries(score)) {
            var colIndex = keys.indexOf(key);
            if (colIndex !== -1) {
                sheet.getRange(rowIndexToUpdate + 1, colIndex + 1).setValue(value);
            }
        }
    }
  
    // Return updated fixtures (assuming gatherFixtures is defined elsewhere)
    return gatherFixtures(fixture.Pitch);
};

