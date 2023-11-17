const { google } = require('googleapis');
const CONFIG = require('../../../config/config')

const KEYFILEPATH = CONFIG.GOOGLE_SERVICE_ACCOUNT_KEY_FILE_PATH
const SPREADSHEET_ID = CONFIG.MASTER_SHEET_ID
const { TOURNAMENT_ID, RANGES } = CONFIG
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const syncWithMasterTable = async (db) => {
    async function accessSpreadsheet() {
        console.log('Syncing with master sheet ...')

        // Create a client instance for the Sheets API
        const auth = new google.auth.GoogleAuth({
            keyFile: KEYFILEPATH,
            scopes: SCOPES
        });
        const client = await auth.getClient();
        const googleSheets = google.sheets({ version: 'v4', auth: client });

        Object.keys(RANGES)
            .filter(range => range === 'fixtures')
            .forEach(async range => {
                const info = RANGES[range]
                const getRows = await googleSheets.spreadsheets.values.get({
                    auth,
                    spreadsheetId: SPREADSHEET_ID,
                    range: RANGES[range].range,
                });
                // Do something with the retrieved rows

                db.query('DELETE FROM fixtures WHERE tournamentId = ?', [TOURNAMENT_ID], (err, results) => {
                    console.log('Previous fixtures deleted.')
                    getRows.data.values
                        // .slice(0, 1)
                        .filter(info.rowFilter || (() => true))
                        .forEach((row, i) => {
                            const fields = Object.keys(info.mappings).join(', ')
                            const values = Object.values(info.mappings)
                                .map((mapping, index) => {
                                    if (typeof mapping === 'function') {
                                        return mapping(row) || 'NULL'
                                    }
                                    return row[mapping] || 'NULL'
                                })
                                .map(x => x === 'NULL' ? x : `'${x}'`)
                            const sql = `INSERT INTO fixtures (${fields}) VALUES (${values});`
                            db.query(sql, (err, results) => {
                                if (err) {
                                    console.error('Error inserting data:', err);
                                    return;
                                }
                                console.log(`Inserted row [${i}] into fixtures table.`);
                            })
                        })
                })
            })
    }

    accessSpreadsheet().catch(console.error);
}

module.exports = syncWithMasterTable;

