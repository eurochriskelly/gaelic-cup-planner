
const mysql = require('mysql');

const { processArgs } = require('./lib/process-args');
const syncWithMaster = require('./lib/google-sheet-sync');
const CONFIG = require('../../config/config');
const apiSetup = require('./api/api-setup');
const ARGS = processArgs(process.argv)



const run = async () => {
  // Set up MySQL connection
  const db = mysql.createConnection(CONFIG.DB_CONN);

  // Connect to the database
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ', err);
      return;
    }
    console.log('Connected to the MySQL server.');
  });


  if (ARGS['sync-from-master']) {
    await syncWithMaster(db)
    setTimeout(async () => {
      process.exit()
    }, 5000)
  } else {
    apiSetup(db, ARGS)
  }
}

run()