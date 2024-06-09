const secrets = require("./secret/info.js");

module.exports = {
  DB_CONN: secrets.db_conn,
  sections: [
    {
      title: "live competitation status",
      name: "competitions",
      action: () => {},
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

