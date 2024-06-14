const { II } = require("../../../lib/logging");

module.exports = (app, db, select) => {
  const { updateScore, testing } = require('./updateScore')(app, db, select);
  return {
    updateScore,
    testing,
    rewindFixture: async (req, res) => {
      const { tournamentId } = req.params;
      II( `Calling API: /api/tournaments/${tournamentId}/fixtures/rewind`);
      const q = `SELECT id, category, stage from fixtures where tournamentId=${tournamentId} and started is not null order by started DESC limit 1`;
      const {id, category, stage} = (await select(q)).data[0];
      await select(`UPDATE fixtures set goals1 = null, points1 = null, goals2 = null, points2 = null, started = null WHERE id = ${id}`)
      res.json({message: `Removed score for category [${category}] fixture [${id}}] stage [${stage}]`});
    },
    cardPlayers: (req, res) => {
      const { id, tournamentId } = req.params;
      II(`Calling API: /api/tournaments/${tournamentId}/fixtures/${id}/carded`);
      const query = [
        "INSERT INTO cards",
        "(tournament, fixture, playerNumber, playerName, cardColor, team)",
        "VALUES",
        req.body
          .map((player) => {
            return `(${tournamentId}, ${id}, ${player.playerNumber}, '${player.playerName}', '${player.playerCard}', '${player.team}')`;
          })
          .join(","),
      ].join(" ");
      db.query(query, (err, results) => {
        if (err) {
          console.log("Error occured", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ data: results });
      });
    },

    startFixture: (req, res) => {
      const { id, tournamentId } = req.params;
      II(`Calling API: /api/tournaments/${tournamentId}/fixtures/${id}/start`);
      const mysqlTimestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const query = [
        "UPDATE fixtures",
        `SET started = '${mysqlTimestamp}'`,
        `WHERE id = ${id};`,
      ].join(" ");

      db.query(query, (err, results) => {
        if (err) {
          console.log("Error occured", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ data: results });
      });
    },

    nextFixtures: (req, res) => {
      const { tournamentId } = req.params;
      II(`Calling API: /api/tournaments/${tournamentId}/fixtures/nextup`);
      const query = `SELECT * FROM v_next_up WHERE tournamentId = ${tournamentId} order by scheduledTime ASC`;
      db.query(query, (err, results) => {
        if (err) {
          console.log("Error occured", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ data: results });
      });
    },

    fixturesByPitch: (req, res) => {
      const { pitch, tournamentId } = req.params;
      II(`Calling API: /api/tournaments/${tournamentId}/fixtures/:pitch`);
      let where = `WHERE tournamentId = ${tournamentId} `
      where += pitch ? `and pitch = '${pitch}' and tournamentId = ${tournamentId}` : "";
      const query = `SELECT * FROM v_fixture_information ${where}`;
      db.query(query, (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ data: results });
      });
    },
  };
};

