const { II, DD, EE } = require("../lib/logging");
const { useMockEndpoints } = require("./mocks");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use(bodyParser.json());

module.exports = (db, ARGS) => {
  console.log("Setting up API endpoints ...");
  app.use(express.static(path.join(__dirname, ARGS.staticPath)));

  if (ARGS.mock) {
    useMockEndpoints(app);
  } else {
    const { select } = require("../lib/db-helper")(db);
    require("./fixtures")(app, db, select);
    require("./tournaments")(app, db, select);

    // API endpoint to get data from the database
    app.get("/api/tournaments/:tournamentId/pitches", async (req, res) => {
      II("Calling API: /api/tournaments/:tournamentId/pitches");
      // FIXME: We need a tournament selection screen when starting the app
      const { tournamentId } = req.params;
      const query =
        "SELECT * FROM v_pitch_events where tournamentId = " + tournamentId;
      console.log(query);
      try {
        const data = await select(query);
        return res.json(data);
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    });

    app.get("/api/tournaments", (req, res) => {
      II("Calling API: /api/tournaments ...");
      const query = `SELECT * FROM v_tournaments`;
      db.query(query, (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        console.log(results);
        res.json({ data: results });
      });
    });

    app.get("/api/group/standings/:tournamentId", async (req, res) => {
      const { tournamentId } = req.params;
      II(`Calling API: /api/group/standings/tournamentId [${tournamentId}]`);
      const groups = await select(
        `SELECT DISTINCT category FROM v_group_standings where tournamentId = ${tournamentId}`
      );
      const query = `SELECT * FROM v_group_standings where tournamentId = ${tournamentId}`;

      db.query(query, (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({
          groups: groups.data.map((g) => g.category),
          data: results,
        });
      });
    });
  }

  // Catchall handler to serve the React index.html
  app.get("*", (req, res) => {
    console.log(`Serving [${ARGS.staticPath}]`);
    res.sendFile(path.join(__dirname, ARGS.staticPath + "/index.html"));
  });

  const { port } = ARGS;
  app.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
};
