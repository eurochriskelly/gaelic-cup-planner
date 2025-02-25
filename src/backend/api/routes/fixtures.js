const express = require("express");
const { II } = require("../../lib/logging");
const fixtureController = require("../controllers/fixtures");

module.exports = (db) => {
  console.log('fixtures router')
  const router = express.Router({mergeParams: true});
  const ctrl = fixtureController(db);

  router.get("/", ctrl.fixturesByPitch);
  router.get("/nextup", ctrl.nextFixtures);
  router.get("/rewind", ctrl.rewindFixture);
  router.get("/:pitch", ctrl.fixturesByPitch);
  router.get("/:id/start", ctrl.startFixture);
  router.post("/:id/score", ctrl.updateScore);
  router.post("/:id/carded", ctrl.cardPlayers);
  router.get("/../carded-players", ctrl.getCardedPlayers); // Adjusted path
  router.get("/../matches-by-pitch", ctrl.getMatchesByPitch); // Adjusted path

  return router;
};
