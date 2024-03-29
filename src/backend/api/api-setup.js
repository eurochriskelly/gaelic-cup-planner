const { II, DD, EE } = require('../lib/logging');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());


module.exports = (db, ARGS) => {
    console.log("Setting up API endpoints ...")
    app.use(express.static(path.join(__dirname, ARGS.staticPath)));

    const { select } = require('../lib/db-helper')(db)
    require('./fixtures')(app, db, select)
    require('./tournaments')(app, db, select)

    // API endpoint to get data from the database
    app.get('/api/pitches', async (req, res) => {
        II('Calling API: /api/pitches')
	// FIXME: We need a tournament selection screen when starting the app
        const query = 'SELECT * FROM v_pitch_events where tournamentId = 6';
        try {
            const data = await select(query)
            return res.json(data)
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    });

    app.get('/api/tournaments', (req, res) => {
        II('Calling API: /api/tournaments ...')
        const parameter = req.params.parameter;
        // Now you can use the 'parameter' variable to fetch specific data from your database
        const query = `SELECT * FROM v_tournaments`;
        db.query(query, (err, results) => {

            if (err) {
                return res.status(500).json({ error: err.message });
            }
            console.log(results)
            res.json({ data: results });
        });
    })

    app.get('/api/group/standings/:tournamentId', async (req, res) => {
        const { tournamentId } = req.params
        II(`Calling API: /api/group/standings/tournamentId [${tournamentId}]`)
        // Now you can use the 'parameter' variable to fetch specific data from your database

        const groups = await select(`SELECT DISTINCT category FROM v_group_standings where tournamentId = ${tournamentId}`)
        const query = `SELECT * FROM v_group_standings where tournamentId = ${tournamentId}`;

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            console.log(results)
            res.json({
                groups: groups.data.map(g => g.category),
                data: results,
            });
        });
    })

     // Catchall handler to serve the React index.html
    app.get('*', (req, res) => {
        console.log(`Serving [${ARGS.staticPath}]`)
        res.sendFile(path.join(__dirname, ARGS.staticPath + '/index.html'));
    });

    const { port } = ARGS
    app.listen(port, () => {
        console.log(`server running on port ${port}`);
    });

}
