const e = require("express");
const { II, DD, EE } = require("../../lib/logging");

module.exports = (app, db, select) => {
  // show routes at top
  const setupApi = (api) => {
    app.get("/api/tournaments", getTournaments);
    app.get("/api/tournaments/:tournamentId", getTournament);
    // FIXME: Do we need additional getters now?
    app.get("/api/tournaments/:tournamentId/groups", getGroups);
    app.get("/api/tournaments/:tournamentId/categories", getCategories);
    app.get("/api/tournaments/:tournamentId/group/:group_id/teams", getTeams);
  };

  const getTournament = async (req, res) => {
    const { tournamentId } = req.params;
    II(`Calling API: /api/tournaments/${tournamentId} ...`);
    let query = "",
      results = [];
    query = `SELECT * FROM tournaments WHERE id = ${tournamentId}`;
    results = await select(query);
    if (!results.data.length) {
      return res.json({ data: null });
    }
    const tournament = results.data[0];
    query = `SELECT category, grp, team FROM v_group_standings WHERE tournamentId = ${tournamentId}`;
    results = await select(query);
    tournament.groups = results.data;

    query = `select id, pitch, location FROM pitches WHERE tournamentId = ${tournamentId}`;
    results = await select(query);
    tournament.pitches = results.data;

    //	console.log(JSON.stringify(tournament, null, 2))
    res.json({ data: tournament });
  };

  const getTournaments = (req, res) => {
    II("Calling API: /api/tournaments ...");
    const query = `SELECT Id, Date, Title, Loctation FROM tournaments`;
    db.query(query, (err, results) => {
      if (err) {
        console.log("Error occured", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ data: results });
    });
  };

  const getGroups = (req, res) => {
    const { tournamentId } = req.params;
    II(`Calling API: /api/tournaments/${tournamentId}/groups ...`);
    const query = `SELECT DISTINCT category FROM fixtures where tournamentId = ${tournamentId}`;
    db.query(query, (err, results) => {
      if (err) {
        console.log("Error occured while getting groups", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ data: results });
    });
  };

  const getCategories = (req, res) => {
    const { tournamentId } = req.params;
    II(`Calling API: /api/tournaments/${tournamentId}/categories ...`);
    const query = `SELECT * FROM v_categories WHERE tournamentId = '${tournamentId}'`;
    db.query(query, (err, results) => {
      if (err) {
        console.log("Error occured while getting groups", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ data: results.map(result => ({
        ...result,
        brackets: result.brackets.split(',').map(x => x.trim())
      })) });
    });
  };

  const getTeams = (req, res) => {
    II("Calling API: /api/tournaments/:tournamentId/group/:group_id/teams ...");
    const { tournamentId, group_id } = req.params;
    const g = group_id.replace(/_/g, " ");
    const query = `
            SELECT id, teamName, category, groupLetter from teams where tournamentId = ${tournamentId} and category = '${g}'
        `;
    db.query(query, (err, results) => {
      if (err) {
        console.log("Error occured while getting teams", err);
        return res.status(500).json({ error: err.message });
      }
      console.log(results);
      res.json({ data: results });
    });
  };

  setupApi();
};
