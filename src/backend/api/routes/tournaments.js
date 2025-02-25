const express = require("express");
const tournamentController = require("../controllers/tournaments");

module.exports = (db) => {
  const router = express.Router();
  const ctrl = tournamentController(db);
  console.log('ever and ever and ever')
console.log(ctrl.createTournament)
  console.log('ever and ever and ever')
  router.post("/", ctrl.createTournament);
  router.get("/", ctrl.getTournaments);
  router.get("/:id", ctrl.getTournament);
  router.put("/:id", ctrl.updateTournament);
  router.delete("/:id", ctrl.deleteTournament);
  router.post("/:id/reset", ctrl.resetTournament);
  router.get("/:id/recent-matches", ctrl.getRecentMatches);
  router.get("/:id/group-fixtures", ctrl.getGroupFixtures);
  router.get("/:id/group-standings", ctrl.getGroupStandings);
  router.get("/:id/knockout-fixtures", ctrl.getKnockoutFixtures);
  router.get("/:id/finals-results", ctrl.getFinalsResults);
  router.get("/:id/all-matches", ctrl.getAllMatches);

  // Squads sub-resource (replaces teams)
  router.post("/:tournamentId/squads", ctrl.createSquad);
  router.get("/:tournamentId/squads", ctrl.getSquads);
  router.get("/:tournamentId/squads/:id", ctrl.getSquad);
  router.put("/:tournamentId/squads/:id", ctrl.updateSquad);
  router.delete("/:tournamentId/squads/:id", ctrl.deleteSquad);

  // Players sub-resource (under squads)
  router.post("/:tournamentId/squads/:squadId/players", ctrl.createPlayer);
  router.get("/:tournamentId/squads/:squadId/players", ctrl.getPlayers);
  router.get("/:tournamentId/squads/:squadId/players/:id", ctrl.getPlayer);
  router.put("/:tournamentId/squads/:squadId/players/:id", ctrl.updatePlayer);
  router.delete("/:tournamentId/squads/:squadId/players/:id", ctrl.deletePlayer);

  return router;
};
