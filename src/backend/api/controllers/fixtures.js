const { II } = require("../../lib/logging");
const dbService = require("../services/dbService");

module.exports = (db) => {
  const dbSvc = dbService(db);

  return {
    fixturesByPitch: async (req, res) => {
      const { tournamentId, pitch } = req.params;
      II(`Calling API: /api/tournaments/${tournamentId}/fixtures${pitch ? `/${pitch}` : ""}`);
      try {
        const fixtures = await dbSvc.getFixturesByPitch(tournamentId, pitch);
        res.json({ data: fixtures });
      } catch (err) {
        throw err;
      }
    },

    nextFixtures: async (req, res) => {
      const { tournamentId } = req.params;
      II(`Calling API: /api/tournaments/${tournamentId}/fixtures/nextup`);
      try {
        const fixtures = await dbSvc.getNextFixtures(tournamentId);
        res.json({ data: fixtures });
      } catch (err) {
        throw err;
      }
    },

    rewindFixture: async (req, res) => {
      const { tournamentId } = req.params;
      II(`Calling API: /api/tournaments/${tournamentId}/fixtures/rewind`);
      try {
        const { id, category, stage } = await dbSvc.rewindLatestFixture(tournamentId);
        res.json({ message: `Removed score for category [${category}] fixture [${id}] stage [${stage}]` });
      } catch (err) {
        throw err;
      }
    },

    startFixture: async (req, res) => {
      const { tournamentId, id } = req.params;
      II(`Calling API: /api/tournaments/${tournamentId}/fixtures/${id}/start`);
      try {
        const result = await dbSvc.startFixture(id);
        res.json({ data: result });
      } catch (err) {
        throw err;
      }
    },

    updateScore: async (req, res) => {
      const { tournamentId, id } = req.params;
      const { team1, team2 } = req.body;
      II(`Calling API: /api/tournaments/${tournamentId}/fixtures/${id}/score`);
      try {
        await dbSvc.updateScore(id, team1, team2, tournamentId);
        res.json({ message: "Score updated successfully" });
      } catch (err) {
        throw err;
      }
    },

    cardPlayers: async (req, res) => {
      const { tournamentId, id } = req.params;
      II(`Calling API: /api/tournaments/${tournamentId}/fixtures/${id}/carded`);
      try {
        const result = await dbSvc.cardPlayers(tournamentId, id, req.body);
        res.json({ data: result });
      } catch (err) {
        throw err;
      }
    },

    getCardedPlayers: async (req, res) => {
      const { tournamentId } = req.params;
      II(`Calling API: /api/tournaments/${tournamentId}/carded-players`);
      try {
        const players = await dbSvc.getCardedPlayers(tournamentId);
        res.json(players);
      } catch (err) {
        throw err;
      }
    },

    getMatchesByPitch: async (req, res) => {
      const { tournamentId } = req.params;
      II(`Calling API: /api/tournaments/${tournamentId}/matches-by-pitch`);
      try {
        const matches = await dbSvc.getMatchesByPitch(tournamentId);
        res.json(matches);
      } catch (err) {
        throw err;
      }
    },
  };
};
