const SS_ID = '1WlGoDODrMlLOn5ojY-gSpi7geCtJDQ01DzcbBwQQ734'

const gatherGroups = () => {
  var spreadsheet = SpreadsheetApp.openById(SS_ID);
  var sheet = spreadsheet.getSheetByName("teams");
  const groups = {}
  const data = sheet.getDataRange().getValues()
  data.slice(2).forEach(team => {
    groups[`${team[2]} ${team[3]}`] = true
  })
  return Object.keys(groups).sort()
}

function getGroupResults(gname) {
  const fieldSorter = (fields) => (a, b) => fields.map(o => {
    let dir = 1
    if (o[0] === '-') { dir = -1; o = o.substring(1); }
    return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0
  }).reduce((p, n) => p ? p : n, 0)


  // Open the active Google Sheet
  var spreadsheet = SpreadsheetApp.openById(SS_ID);
  var sheet = spreadsheet.getSheetByName("Results");

  // Get the last filled row and column
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();

  // Read header and data rows
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  // Initialize an empty array to hold the data objects
  var dataArray = [];

  // Loop through each data row
  for (var i = 0; i < Math.min(data.length, 120); i++) {
    var rowObj = {};
    // Loop through each column in the row
    for (var j = 0; j < lastCol; j++) {
      rowObj[headers[j]] = data[i][j];
    }
    // Push the object into dataArray
    dataArray.push(rowObj);
  }

  let teamStatuses = []
  const teamList = {}
  const groupList = {}
  dataArray
    .filter(x => x.Stage === 'Group')
    .forEach(d => {
      teamList[d.Name1] = true
      teamList[d.Name2] = true
    })
  const teams = Object.keys(teamList)
  teams.forEach(team => {
    const group = team.substring(0, 3)
    groupList[group] = true
    const data = dataArray
      .filter(d => d.Name1 == team || d.Name2 == team)
      .filter(d => d.Goals1 !== '' && d.Points1 !== '' && d.Goals2 !== '' && d.Points2 !== '')
      .map(d => {
        const { Goals1, Goals2, Points1, Points2, Name1, Name2 } = d
        let gFrom = Goals1
        let pFrom = Points1
        let gAgainst = Goals2
        let pAgainst = Points2
        let nameFrom = Name1
        let nameAgainst = Name2
        if (Name2 == team) {
          gFrom = Goals2
          pFrom = Points2
          gAgainst = Goals1
          pAgainst = Points1
          nameFrom = Name2
          nameAgainst = Name1
        }

        const scoreFrom = gFrom * 3 + pFrom
        const scoreAgainst = gAgainst * 3 + pAgainst
        return {
          team: nameFrom,
          mid: d.MID,
          scoreText: `${gFrom}-${pFrom} (${scoreFrom}) vs ${gAgainst}-${pAgainst} (${scoreAgainst}))`,
          scoreFrom, scoreAgainst,
          goalDifference: scoreFrom - scoreAgainst,
          opponent: nameAgainst,
          outcome: scoreFrom > scoreAgainst
            ? 'win'
            : scoreFrom < scoreAgainst
              ? 'loss'
              : 'draw',
          pointsEarned: scoreFrom > scoreAgainst ? 2 : scoreFrom < scoreAgainst ? 0 : 1,
        }
      })
      .reduce((status, result) => {
        status.MP += 1
        status.W += result.outcome === 'win' ? 1 : 0
        status.D += result.outcome === 'draw' ? 1 : 0
        status.L += result.outcome === 'loss' ? 1 : 0
        status.PF += result.scoreFrom
        status.PA += result.scoreAgainst
        status.PD += result.goalDifference
        status.Pts += result.pointsEarned
        return status
      }, {
        team: team.substring(4), group, MP: 0, W: 0, D: 0, L: 0, PF: 0, PA: 0, PD: 0, Pts: 0
      })

    teamList[team] = data
    teamStatuses = Object.values(teamList)
      .sort(fieldSorter(['group', '-Pts', '-PD', '-PF']))
      .filter(ts => {
        return (ts.group || '').startsWith(gname)
      })
  })

  return teamStatuses
}

const test_getGroupResults = () => {
  const groupResults = getGroupResults('MI')
  Logger.log(groupResults.slice(0, 3))
}