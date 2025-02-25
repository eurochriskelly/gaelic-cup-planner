const { II } = require("../../lib/logging");
const { jsonToCsv, sendXsls } = require("../../lib/utils");
const dbService = require("../services/dbService");

module.exports = (db) => {
  const dbSvc = dbService(db);

  return {
    listPitches: async (req, res) => {
      II(`Calling API: /api/tournaments/${req.params.tournamentId}/pitches`);
      try {
        const pitches = await dbSvc.listPitches(req.params.tournamentId);
        res.json({ data: pitches });
      } catch (err) {
        throw err;
      }
    },

    listStandings: async (req, res) => {
      const { tournamentId } = req.params;
      const { format = "json", category } = req.query;
      II(`Calling API: /api/tournaments/${tournamentId}/standings${category ? `/${category}` : ""}`);
      try {
        const { groups, data } = await dbSvc.listStandings(tournamentId, category);
        switch (format) {
          case "csv":
            const csv = jsonToCsv(data);
            res.setHeader("Content-Disposition", 'attachment; filename="standings.csv"');
            res.set("Content-Type", "text/csv; charset=utf-8");
            res.send(csv);
            break;
          case "xlsx":
            sendXsls(data, res, "standings");
            break;
          default:
            res.json({ groups, data });
            break;
        }
      } catch (err) {
        throw err;
      }
    },
  };
};

