const { useMockEndpoints } = require("./mocks");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use(bodyParser.json());

module.exports = (db, ARGS) => {
  console.log("Setting up API endpoints ...");
  app.use(express.static(path.join(__dirname, ARGS.staticPath)));
  // Endpoint to handle file upload
  app.post("/api/upload", (req, res) => {
    parseFormData(req, res, (filePath) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading file:", err);
          return res.status(500).send("Error reading file");
        }
        // Log the contents of the file
        console.log("File contents:", data);
        // Send a response back to the client
        res.send("File received and contents logged.");
      });
    });
  });

  if (ARGS.mock) {
    useMockEndpoints(app);
  } else {
    const { select, wrapGET } = require("../lib/db-helper")(db);

    const R = require("./apis/regions")(db, select);
    app.get("/api/regions", R.listRegions);
    app.get("/api/regions/:region", R.listRegionInfo);
    // app.get("/api/regions/:region/teams", O.listRegionTeams);

    const G = require("./apis/general")(app, db, select);
    app.get("/api/tournaments", G.listTournaments);
    app.get("/api/tournaments/:tournamentId/pitches", G.listPitches);
    app.get("/api/tournaments/:tournamentId/standings", G.listStandings);

    const F = require("./apis/fixtures")(app, db, select);
    app.get("/api/tournaments/:tournamentId/fixtures", F.fixturesByPitch);
    app.get("/api/tournaments/:tournamentId/fixtures/nextup", F.nextFixtures);
    app.get("/api/tournaments/:tournamentId/fixtures/rewind", F.rewindFixture);
    app.get(
      "/api/tournaments/:tournamentId/fixtures/:pitch",
      F.fixturesByPitch,
    );
    app.get(
      "/api/tournaments/:tournamentId/fixtures/:id/start",
      F.startFixture,
    );
    app.post(
      "/api/tournaments/:tournamentId/fixtures/:id/score",
      F.updateScore,
    );
    app.post(
      "/api/tournaments/:tournamentId/fixtures/:id/carded",
      F.cardPlayers,
    );

    const T = require("./apis/tournaments")(app, db, select);
    //app.get("/api/tournaments", T.getTournaments);
    app.get("/api/tournaments/:tournamentId", T.getTournament);
    app.get("/api/tournaments/:tournamentId/reset", T.resetTournament);
    app.get("/api/tournaments/:tournamentId/groups", T.getGroups);
    app.get("/api/tournaments/:tournamentId/results/:category", T.getResults);
    app.get("/api/tournaments/:tournamentId/categories", T.getCategories);
    app.get("/api/tournaments/:tournamentId/group/:group_id/teams", T.getTeams);
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

// Function to parse multipart/form-data
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

          // Save the file content to a file
          const filePath = path.join(__dirname, "uploads", filename);
          fs.writeFileSync(filePath, fileContent);

          // Callback with the file path
          callback(filePath);
        }
      }
    });
  });
}
