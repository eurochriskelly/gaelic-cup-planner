const { II } = require("../../lib/logging");
const { jsonToCsv, sendXsls } = require("../../lib/utils");
const dbService = require("../services/dbService");

module.exports = (db) => {
  const dbSvc = dbService(db);

  return {
    getTournaments: async (req, res) => {
      II("Calling API: /api/tournaments ...");
      try {
        const tournaments = await dbSvc.getTournaments();
        res.json({ data: tournaments });
      } catch (err) {
        throw err;
      }
    },

    getTournament: async (req, res) => {
      const { id } = req.params;
      II(`Calling API: /api/tournaments/${id} ...`);
      try {
        const tournament = await dbSvc.getTournament(id);
        res.json({ data: tournament });
      } catch (err) {
        throw err;
      }
    },

    resetTournament: async (req, res) => {
      const { id } = req.params;
      II(`Calling API: /api/tournaments/${id}/reset ...`);
      try {
        if (+id === 1) {
          await dbSvc.resetTournament(id);
          res.json({ message: "Tournament reset successfully" });
        } else {
          res.status(403).json({ message: "Only sandbox tournament (id=1) can be reset" });
        }
      } catch (err) {
        throw err;
      }
    },

    getGroups: async (req, res) => {
      const { id } = req.params;
      II(`Calling API: /api/tournaments/${id}/groups ...`);
      try {
        const groups = await dbSvc.getTournamentGroups(id);
        res.json({ data: groups });
      } catch (err) {
        throw err;
      }
    },

    getResults: async (req, res) => {
      const { id, category } = req.params;
      const { format = "json" } = req.query;
      II(`Calling API: /api/tournaments/${id}/results/${category} ...`);
      try {
        const results = await dbSvc.getTournamentResults(id, category);
        switch (format) {
          case "csv":
            const csv = jsonToCsv(results);
            res.setHeader("Content-Disposition", 'attachment; filename="data.csv"');
            res.set("Content-Type", "text/csv; charset=utf-8");
            res.send(csv);
            break;
          case "xlsx":
            sendXsls(results, res, "results");
            break;
          default:
            res.json({ data: results });
            break;
        }
      } catch (err) {
        throw err;
      }
    },

    getCategories: async (req, res) => {
      const { id } = req.params;
      II(`Calling API: /api/tournaments/${id}/categories ...`);
      try {
        const categories = await dbSvc.getTournamentCategories(id);
        res.json({
          data: categories.map((cat) => ({
            ...cat,
            brackets: cat.brackets.split(",").map((x) => x.trim()),
          })),
        });
      } catch (err) {
        throw err;
      }
    },

    getTeams: async (req, res) => {
      const { id, group_id } = req.params;
      II(`Calling API: /api/tournaments/${id}/group/${group_id}/teams ...`);
      try {
        const teams = await dbSvc.getTournamentTeams(id, group_id.replace(/_/g, " "));
        res.json({ data: teams });
      } catch (err) {
        throw err;
      }
    },

    getRecentMatches: async (req, res) => {
      const { id } = req.params;
      II(`Calling API: /api/tournaments/${id}/recent-matches`);
      try {
        const [count, matches] = await Promise.all([
          dbSvc.getStartedMatchCount(id),
          dbSvc.getRecentMatches(id),
        ]);
        res.json({ matchCount: count, matches });
      } catch (err) {
        throw err;
      }
    },

    getGroupFixtures: async (req, res) => {
      const { id } = req.params;
      II(`Calling API: /api/tournaments/${id}/group-fixtures`);
      try {
        const fixtures = await dbSvc.getGroupFixtures(id);
        res.json(fixtures);
      } catch (err) {
        throw err;
      }
    },

    getGroupStandings: async (req, res) => {
      const { id } = req.params;
      II(`Calling API: /api/tournaments/${id}/group-standings`);
      try {
        const standings = await dbSvc.getGroupStandings(id);
        res.json(standings);
      } catch (err) {
        throw err;
      }
    },

    getKnockoutFixtures: async (req, res) => {
      const { id } = req.params;
      II(`Calling API: /api/tournaments/${id}/knockout-fixtures`);
      try {
        const fixtures = await dbSvc.getKnockoutFixtures(id);
        res.json(fixtures);
      } catch (err) {
        throw err;
      }
    },

    getFinalsResults: async (req, res) => {
      const { id } = req.params;
      II(`Calling API: /api/tournaments/${id}/finals-results`);
      try {
        const results = await dbSvc.getFinalsResults(id);
        res.json(results);
      } catch (err) {
        throw err;
      }
    },

    getAllMatches: async (req, res) => {
      const { id } = req.params;
      II(`Calling API: /api/tournaments/${id}/all-matches`);
      try {
        const matches = await dbSvc.getAllMatches(id);
        res.json(matches);
      } catch (err) {
        throw err;
      }
    },
  };
};
