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
    if (!pitch) {
        return [];
    }
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
                id: d.Name1 + d.Name2 + d.Scheduled + d.Pitch,
            };
        })
        .filter(d => !id || d.id === id);
    
    return result;
}

