const secrets = require("./secret/info.js");

const TOURNAMENT_ID = 3;

const mapfns = {
  teamFix: (n) => (row) => {
    if (row[n]) {
      if (row[n][3] === "-") {
        return row[n].substring(4);
      }
      return row[n];
    }
    return "NULL";
  },
  timeToDateTime: (n) => (row) => {
    if (!row[n]) return "NULL";
    return (
      new Date().toISOString().split("T")[0] +
      " " +
      (`0` + row[n]).substr(-5) +
      ":00"
    );
  },
  lower: (n) => (row) => row[n].toLowerCase(),
  groupNumber: (n) => (row) => row[n] || -1,
};

module.exports = {
  MASTER_SHEET_ID: "1WlGoDODrMlLOn5ojY-gSpi7geCtJDQ01DzcbBwQQ734",
  GOOGLE_SERVICE_ACCOUNT_KEY_FILE_PATH:
    "config/secret/eurotourno-094ccc5bf6bc.json",
  TOURNAMENT_ID,
  DB_CONN: secrets.db_conn,
  sections: [
    {
      title: "live competitation status",
      name: "competitions",
      action: () => {
        console.log("foo fah");
      },
    },
    {
      title: "field coordination",
      name: "pitches",
      action: () => {
        console.log("fee faw");
      },
    },
  ],
};

