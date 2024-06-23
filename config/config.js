const { write } = require("xlsx");

module.exports = {
  dbConf: {
    host: process.env['GG_HST'],
    user: process.env['GG_USR'],
    password: process.env['GG_PWD'],
    database: process.env['GG_DBN']
  },
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
      },
    },
  ],
};

