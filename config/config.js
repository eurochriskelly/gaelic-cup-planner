const secrets = require('./secret/info.js')

const TOURNAMENT_ID = 3;

const mapfns = {
    teamFix: (n) => row => {
        if (row[n]) {
            if (row[n][3] === '-') {
                return row[n].substring(4)
            }
            return row[n]
        }
        return 'NULL'
    },
    timeToDateTime: (n) => row => {
        if (!row[n]) return 'NULL'
        return new Date().toISOString().split('T')[0] + ' ' + (`0` + row[n]).substr(-5) + ':00'
    },
    lower: (n) => row => row[n].toLowerCase(),
    groupNumber: (n) => row => row[n] || -1,
}

module.exports = {
    MASTER_SHEET_ID: '1WlGoDODrMlLOn5ojY-gSpi7geCtJDQ01DzcbBwQQ734',
    GOOGLE_SERVICE_ACCOUNT_KEY_FILE_PATH: 'config/secret/eurotourno-094ccc5bf6bc.json',
    TOURNAMENT_ID,
    RANGES: {
        pitches: {
            range: 'Pitches!A2:C30',
            mappings: {
                id: 0,
                location: 1,
                type: 2,
            }
        },
        fixtures: {
            range: 'Fixtures!A2:N500',
            rowFilter: row => row[7] && row[7] !== '#REF!', // Must have at least one team 
            mappings: {
                tournamentId: () => TOURNAMENT_ID,
                category: 1,
                groupNumber: mapfns.groupNumber(2),
                stage: mapfns.lower(3),
                pitch: 4,
                scheduled: mapfns.timeToDateTime(5),
                started: mapfns.timeToDateTime(6),
                team1Id: mapfns.teamFix(7),
                goals1: 8,
                points1: 9,
                team2Id: mapfns.teamFix(10),
                goals2: 11,
                points2: 12,
                umpireTeamId: mapfns.teamFix(13),
            }
        },
        teams: {
            range: 'Teams!A2:G200',
            mappings: {
                id: 0,
                name: 1,
                category: 2,
                group: 3,
                stage: 4,
            }
        },
        coordinators: {
            range: 'Coordinators!A2:B50',
            mappings: {
                id: 0,
                name: 1,
            }
        }
    },
    DB_CONN: secrets.db_conn,
}