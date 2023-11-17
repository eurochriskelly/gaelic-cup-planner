const { II, DD, EE } = require('../../lib/logging')

module.exports = (app, db, select) => {

    /* Check if a given stage is complete */
    const processStageCompletion = async (fixtureId) => {
        const selQuery = `SELECT tournamentId, stage, groupNumber, category FROM fixtures WHERE id = ${fixtureId}`
        const data = await select(selQuery)
        const { tournamentId, stage, groupNumber, category } = data.data[0]
        const completedQuery = [
            `select count(*) as remaining from fixtures where `,
            `tournamentId = ${tournamentId} and `,
            `stage = '${stage}' and `,
            `groupNumber = ${groupNumber} and `,
            `category = '${category}' and `,
            `goals1 is null`,

        ].join(' ')
        const remainingMatchesInStage = +(await select(completedQuery))?.data[0]?.remaining
        if (!remainingMatchesInStage) {
            console.log(`No remaining matches in stage [${stage}/${groupNumber}] for [${category}]!`)
            // Loop over each team in stage/groupNumber and update any playoff fixtures 
            // that are dependent on this outcome of this stage
            const teamsQuery = [
                `SELECT DISTINCT team1 FROM fixtures WHERE `,
                `tournamentId = ${tournamentId} and `,
                `stage = '${stage}' and `,
                `groupNumber = ${groupNumber} and `,
                `category = '${category}'`,
            ].join(' ')
            const teams = await select(teamsQuery)
            console.log(teams.data)
            return true
        }
        console.log(`Stage [${stage}/${groupNumber}] for [${category}] has [${remainingMatchesInStage}] remaining matches.`)
        return false
    }

    /* Update the score
     * 1. Update the score
     * 2. Check if the stage is complete
     *    2.1 If yes, update the playoff fixtures based on new information
     */
    const updateScore = async (req, res) => {
        II('Calling API: /api/fixtures/:id/score')
        try {
            const { id } = req.params
            const { team1, team2 } = req.body
            const updateQuery = [
                "UPDATE fixtures",
                `SET goals1 = '${team1.goals}', points1 = '${team1.points}', `,
                `    goals2 = '${team2.goals}', points2 = '${team2.points}'`,
                `WHERE id = ${id};`,
            ].join(' ')
            await select(updateQuery)
            console.log('select group ...')
            await processStageCompletion(id)
            res.json({
                message: 'Score updated successfully.'
            });
        } catch (err) {
            console.log('Error occured', err)
            return res.status(500).json({ error: err.message });
        }
    }

    const startFixture = (req, res) => {
        II('Calling API: /api/fixtures/:id/start')
        const { id } = req.params
        const mysqlTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const query = [
            "UPDATE fixtures",
            `SET started = '${mysqlTimestamp}'`,
            `WHERE id = ${id};`,
        ].join(' ')

        db.query(query, (err, results) => {
            if (err) {
                console.log('Error occured', err)
                return res.status(500).json({ error: err.message });
            }
            res.json({ data: results });
        });
    }

    const nextFixtures = (req, res) => {
        II('Calling API: /api/fixtures/nextup/:tournament_id')
        const { tournament_id } = req.params
        const query = `SELECT * FROM v_next_up WHERE tournamentId = ${tournament_id}`

        db.query(query, (err, results) => {
            if (err) {
                console.log('Error occured', err)
                return res.status(500).json({ error: err.message });
            }
            res.json({ data: results });
        });
    }

    const fixturesByPitch = (req, res) => {
        II('Calling API: /api/fixtures/:pitch')
        const pitch = req.params.pitch;
        // Now you can use the 'parameter' variable to fetch specific data from your database
        const query = `SELECT * FROM v_fixture_information WHERE pitch = '${pitch}'`;

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ data: results });
        });
    }

    app.get('/api/fixtures/:pitch', fixturesByPitch)
    app.get('/api/fixtures/nextup/:tournament_id', nextFixtures)
    app.get('/api/fixtures/:id/start', startFixture)
    app.post('/api/fixtures/:id/score', updateScore)
}


