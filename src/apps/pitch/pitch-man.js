const SS_ID = '1WlGoDODrMlLOn5ojY-gSpi7geCtJDQ01DzcbBwQQ734'

const gatherPitches = () => {
    var spreadsheet = SpreadsheetApp.openById(SS_ID);
    var sheet = spreadsheet.getSheetByName("pitches");
    var data = sheet.getDataRange().getValues();
    
    var result = [];
    
    for (var i = 1; i < data.length; i++) { // Start from 1 to skip the header row
      var pitch = data[i][0];
      var location = data[i][1];
      
      if (pitch && location) { // Check if both columns have values
        result.push({pitch, location});
      }
    }
    
    return result;
}

const gatherFixtures = (pitch, id) => {
    if (!pitch) return [];
    
    var spreadsheet = SpreadsheetApp.openById(SS_ID);
    var sheet = spreadsheet.getSheetByName("results");
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


const test_gatherFixtures = () => {
    const result = gatherFixtures('S1');
    Logger.log(JSON.stringify(result[0], null, 2))
}

const test_updateScore = () => {
    const fixture = {
        "Goals1": 1,
        "Points1": 6,
        "Goals2": 2,
        "Points2": 1,
        "Group": 2,
        "Started": "",
        "Total1": 9,
        "Pts1": 3,
        "Pts2": 0,
        "Total2": 7,
        "MID": 56,
        "Winner": "MJ2-Den Haag B",
        "Scheduled": "09:35",
        "Reported": "x",
        "Pitch": "W2",
        "Stage": "Group",
        "id": "MJ2-Den Haag BMJ2-MondevilleSat Dec 30 1899 09:35:39 GMT+0000 (Central European Standard Time)W2",
        "Name1": "MJ2-Den Haag B",
        "Catgory": "MJ2",
        "Name2": "MJ2-Mondeville"
    }
    const score = { 
        "Goals1": 9,
        "Points1": 9,
        "Goals2": 9,
        "Points2": 9,
    }
    updateScore(fixture, score);
}