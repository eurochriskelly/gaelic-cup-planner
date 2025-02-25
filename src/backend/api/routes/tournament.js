const express = require("express");
const { II } = require("../../lib/logging");
const tournamentController = require("../controllers/tournaments");

module.exports = (db) => {
  const router = express.Router();
  const ctrl = tournamentController(db);

  router.get("/", ctrl.getTournaments); // Moved from general.js
  router.get("/:id", ctrl.getTournament);
  router.get("/:id/reset", ctrl.resetTournament);
  router.get("/:id/groups", ctrl.getGroups);
  router.get("/:id/results/:category", ctrl.getResults);
  router.get("/:id/categories", ctrl.getCategories);
  router.get("/:id/group/:group_id/teams", ctrl.getTeams);
  router.get("/:id/recent-matches", ctrl.getRecentMatches);
  router.get("/:id/group-fixtures", ctrl.getGroupFixtures);
  router.get("/:id/group-standings", ctrl.getGroupStandings);
  router.get("/:id/knockout-fixtures", ctrl.getKnockoutFixtures);
  router.get("/:id/finals-results", ctrl.getFinalsResults);
  router.get("/:id/all-matches", ctrl.getAllMatches);

  return router;
};
