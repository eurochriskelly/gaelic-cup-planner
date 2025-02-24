// api/api-setup.js
const { useMockEndpoints } = require("./mocks");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const fs = require("fs"); // Added for parseFormData (already used)

app.use(bodyParser.json());

module.exports = (db, ARGS) => {
  console.log("Setting up API endpoints ...");
  app.use(express.static(path.join(__dirname, ARGS.staticPath)));

  // Existing endpoint
  app.post("/api/upload", (req, res) => {
    parseFormData(req, res, (filePath) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading file:", err);
          return res.status(500).send("Error reading file");
        }
        console.log("File contents:", data);
        res.send("File received and contents logged.");
      });
    });
  });

  if (ARGS.mock) {
    useMockEndpoints(app);
  } else {
    const { select, wrapGET } = require("../lib/db-helper")(db);

    // Existing modules
    const R = require("./apis/regions")(db, select);
    app.get("/api/regions", R.listRegions);
    app.get("/api/regions/:region", R.listRegionInfo);

    const G = require("./apis/general")(app, db, select);
    app.get("/api/tournaments", G.listTournaments);
    app.get("/api/tournaments/:tournamentId/pitches", G.listPitches);
    app.get("/api/tournaments/:tournamentId/standings", G.listStandings);

    const F = require("./apis/fixtures")(app, db, select);
    app.get("/api/tournaments/:tournamentId/fixtures", F.fixturesByPitch);
    app.get("/api/tournaments/:tournamentId/fixtures/nextup", F.nextFixtures);
    app.get("/api/tournaments/:tournamentId/fixtures/rewind", F.rewindFixture);
    app.get("/api/tournaments/:tournamentId/fixtures/:pitch", F.fixturesByPitch);
    app.get("/api/tournaments/:tournamentId/fixtures/:id/start", F.startFixture);
    app.post("/api/tournaments/:tournamentId/fixtures/:id/score", F.updateScore);
    app.post("/api/tournaments/:tournamentId/fixtures/:id/carded", F.cardPlayers);

    const T = require("./apis/tournaments")(app, db, select);
    app.get("/api/tournaments/:tournamentId", T.getTournament);
    app.get("/api/tournaments/:tournamentId/reset", T.resetTournament);
    app.get("/api/tournaments/:tournamentId/groups", T.getGroups);
    app.get("/api/tournaments/:tournamentId/results/:category", T.getResults);
    app.get("/api/tournaments/:tournamentId/categories", T.getCategories);
    app.get("/api/tournaments/:tournamentId/group/:group_id/teams", T.getTeams);

    // New endpoints (delegated to existing or new modules)
    app.get("/api/tournaments/:id/recent-matches", T.getRecentMatches); // Added to tournaments.js
    app.get("/api/tournaments/:id/group-fixtures", T.getGroupFixtures); // Added to tournaments.js
    app.get("/api/tournaments/:id/group-standings", T.getGroupStandings); // Added to tournaments.js
    app.get("/api/tournaments/:id/knockout-fixtures", T.getKnockoutFixtures); // Added to tournaments.js
    app.get("/api/tournaments/:id/carded-players", F.getCardedPlayers); // Added to fixtures/index.js
    app.get("/api/tournaments/:id/matches-by-pitch", F.getMatchesByPitch); // Added to fixtures/index.js
    app.get("/api/tournaments/:id/finals-results", T.getFinalsResults); // Added to tournaments.js
    app.get("/api/tournaments/:id/all-matches", T.getAllMatches); // Added to tournaments.js

    const A = require("./apis/auth")(db, select); // New auth module
    app.post("/api/auth/login", A.login);
  }

  // Existing catchall
  app.get("*", (req, res) => {
    console.log(`Serving [${ARGS.staticPath}]`);
    res.sendFile(path.join(__dirname, ARGS.staticPath + "/index.html"));
  });

  const { port } = ARGS;
  app.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
};

// Existing parseFormData function (unchanged)
function parseFormData(req, res, callback) {
  const boundary = req.headers["content-type"].split("boundary=")[1];
  let data = "";

  req.on("data", (chunk) => {
    data += chunk.toString();
  });

  req.on("end", () => {
    const parts = data.split("--" + boundary);
    parts.forEach((part) => {
      if (part.includes("Content-Disposition")) {
        const nameMatch = part.match(/name="([^"]+)"/);
        const filenameMatch = part.match(/filename="([^"]+)"/);

        if (filenameMatch) {
          const filename = filenameMatch[1];
          const fileContent = part.split("\r\n\r\n")[1].split("\r\n--")[0];
          const filePath = path.join(__dirname, "uploads", filename);
          fs.writeFileSync(filePath, fileContent);
          callback(filePath);
        }
      }
    });
  });
}
