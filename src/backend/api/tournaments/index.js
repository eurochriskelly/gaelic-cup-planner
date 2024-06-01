const e = require('express')
const { II, DD, EE } = require('../../lib/logging')

module.exports = (app, db, select) => {
    const getTournament = async (req, res) => {
    const { tournament_id } = req.params
    II(`Calling API: /api/tournaments/${tournament_id} ...`)
    let query = '', results = []
	query = `SELECT * FROM tournaments where id = ${tournament_id}`
        results = await select(query)
	if (!results.data.length) {
	    return res.json({"data": null})
	}
	const tournament = results.data[0]
	query = `select category, grp, team from v_group_standings where tournamentId = ${tournament_id}`
	results = await select(query)
	tournament.groups = results.data
    app.get("/api/tournaments/:tournamentId/categories", getCategories);

	query = `select id, pitch, location from pitches where tournamentId = ${tournament_id}`
	results = await select(query)
	tournament.pitches = results.data
	
//	console.log(JSON.stringify(tournament, null, 2))
	res.json({data: tournament})
    }

    const getTournaments = (req, res) => {
        II('Calling API: /api/tournaments ...')
        const query = `SELECT Id, Date, Title, Location FROM tournaments`
        db.query(query, (err, results) => {
            if (err) {
                console.log('Error occured', err)
                return res.status(500).json({ error: err.message });
            }
            res.json({ data: results });
        });
    }

    const getGroups = (req, res) => {
        II('Calling API: /api/tournaments/:tournament_id/groups ...')
        const { tournament_id } = req.params
        const query = `SELECT DISTINCT category FROM fixtures where tournamentId = ${tournament_id}`
        db.query(query, (err, results) => {
            if (err) {
                console.log('Error occured while getting groups', err)
                return res.status(500).json({ error: err.message });
            }
            res.json({ data: results });
        });
    }

    const getTeams = (req, res) => {
        II('Calling API: /api/tournaments/:tournament_id/group/:group_id/teams ...')
        const { tournament_id, group_id } = req.params
        const g = group_id.replace(/_/g, ' ')
        const query = `
            SELECT id, teamName, category, groupLetter from teams where tournamentId = ${tournament_id} and category = '${g}'
        `
        db.query(query, (err, results) => {
            if (err) {
                console.log('Error occured while getting teams', err)
                return res.status(500).json({ error: err.message });
            }
            console.log(results)
            res.json({ data: results });
        });
    }

    app.get('/api/tournaments', getTournaments)
    app.get('/api/tournaments/:tournament_id', getTournament)
    // FIXME: Do we need additional getters now?
    app.get('/api/tournaments/:tournament_id/groups', getGroups)
    app.get('/api/tournaments/:tournament_id/group/:group_id/teams', getTeams)
}
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

