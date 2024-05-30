// Keep in separate file so it can be hotloaded on demamd

module.exports = {
  "/api/tournaments/:tournamentId/pitches": "pitches",
  // fixme: supersede this  and keep next
  "/api/group/standings/:tournamentId": "standings",
  "/api/tournaments/:tournamentId/standings": "standings",
  "/api/tournaments/:tournamentId/categories": "categories",
  "/api/tournaments/:tournamentId/groups": "groups",
  "/api/tournaments": "tournaments",
  // fixtures/index.js
  "/api/fixtures": "fixtures",
  "/api/fixtures/:pitch": "fixturesByPitchA",
};
