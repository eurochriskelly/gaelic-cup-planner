const { II } = require("../../lib/logging");
const { jsonToCsv, sendXsls } = require("../../lib/utils");
const { calculateRankings } = require('./fixtures/queries');

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

    listTournaments: (req, res) => {
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
      const { format = "json", category } = req.query;
      if (category) {
        II(
          `Calling API: /api/tournaments/${tournamentId}/group/standings/${category}`
        );
      } else {
        II(`Calling API: /api/tournaments/${tournamentId}/group/standings`);
      }

      let extra = category ? ` and category = '${category}'` : "";
      const groups = await select(
        `SELECT DISTINCT category FROM v_group_standings where tournamentId = ${tournamentId} ${extra}`
      );
      const query = `SELECT * FROM v_group_standings where tournamentId = ${tournamentId} ${extra}`;

      db.query(query, (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        switch (format) {
          case "csv":
            const csv = jsonToCsv(results);
            res.setHeader(
              "Content-Disposition",
              'attachment; filename="data.csv"'
            );
            res.set("Content-Type", "text/csv; charset=utf-8");
            res.send(csv);
            break;
          case "xslx":
          case "xlsx":
            sendXsls(results, res, "standings");
            break;
          default:
            res.json({
              groups: groups.data.map((g) => g.category),
              data: results,
            });
            break;
        }
      });
    },

    listRankings: async (req, res) => {
      const { tournamentId } = req.params;
      const { category } = req.query;
      if (!category) {
        return res.json({ message: 'Category required!'});
      }
      II(`Calling API: /api/tournaments/${tournamentId}/group/rankings`);
      const results = await calculateRankings(tournamentId, category, select);
      switch (format) {
        case "csv":
          const csv = jsonToCsv(results);
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="rankings-${tournamentId}-${category.replace(/ /g, '')}.csv"`
          );
          res.set("Content-Type", "text/csv; charset=utf-8");
          res.send(csv);
          break;
        case "xslx":
        case "xlsx":
          sendXsls(results, res, "rankings");
          break;
        default:
          res.json({
            groups: groups.data.map((g) => g.category),
            data: results,
          });
          break;
      }
      res.json({ results });
    },
  };
};
