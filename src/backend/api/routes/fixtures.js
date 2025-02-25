const express = require("express");
const { II } = require("../../lib/logging");
const fixtureController = require("../controllers/fixtures");

module.exports = (db) => {
  const router = express.Router({mergeParams: true});
  const ctrl = fixtureController(db);

  router.get("/", ctrl.fixturesByPitch);
  router.get("/:id", ctrl.getFixture);
  router.get("/nextup", ctrl.nextFixtures);
  router.get("/rewind", ctrl.rewindFixture);
  router.get("/:fixtureId/carded-players", ctrl.getCardedPlayers);
  router.get("/:pitch", ctrl.fixturesByPitch);
  router.get("/:id/start", ctrl.startFixture);
  router.post("/:id/score", ctrl.updateScore);
  router.post("/:id/carded", ctrl.cardPlayers)

  return router;
};
