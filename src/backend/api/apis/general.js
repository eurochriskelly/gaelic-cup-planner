const { II, DD, EE } = require("../../lib/logging");

module.exports = (app, db, select) => {
  return {
    listPitches: async (req, res) => {
      II("Calling API: /api/tournaments/:tournamentId/pitches");
      // FIXME: We need a tournament selection screen when starting the app
      const { tournamentId } = req.params;
      let query =
        "SELECT * FROM v_pitch_events where tournamentId = " + tournamentId;
      try {
        let data = await select(query);
        if (!data.data.length) {
          let query =
            "SELECT * FROM pitches where tournamentId = " + tournamentId;
          data = await select(query);
          return res.json(data);
        }
        return res.json(data);
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    },

    listTouraments: (req, res) => {
      II("Calling API: /api/tournaments ...");
      const query = `SELECT * FROM v_tournaments`;
      db.query(query, (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        console.log(results);
        res.json({ data: results });
      });
    },

    listStandings: async (req, res) => {
      const { tournamentId } = req.params;
      II(`Calling API: /api/tournaments/${tournamentId}/group/standings`);
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
    },
  };
};

