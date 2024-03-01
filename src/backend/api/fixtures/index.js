const { II, DD, EE } = require('../../lib/logging')

module.exports = (app, db, select) => {
    /* Check if a given stage is complete */
    const processStageCompletion = async (fixtureId) => {
        const selQuery = [
            `SELECT tournamentId, stage, groupNumber, `,
            `  category FROM fixtures WHERE id = ${fixtureId}`
        ].join(' ')
        const data = await select(selQuery)
        const { tournamentId, stage, groupNumber, category } = data?.data[0]
        const completedQuery = [
            `SELECT count(*) as remaining FROM fixtures WHERE `,
            `  tournamentId = ${tournamentId} and `,
            `  stage = '${stage}' and `,
            `  groupNumber = ${groupNumber} and `,
            `  category = '${category}' and `,
            `  goals1 is null`,

        ].join(' ')
        const remainingMatchesInStage = +(await select(completedQuery))?.data[0]?.remaining
        if (!remainingMatchesInStage) {
            const qGroupStandings = [
                `SELECT * FROM v_group_standings where `,
                `  tournamentId = ${tournamentId} and `,
                `  grp = ${groupNumber} and `,
                `  category = '${category}'`
            ].join(' ')
            const groupStandings = (await select(qGroupStandings)).data
            // Loop over each team in stage/groupNumber and update any playoff fixtures 
            // that are dependent on this outcome of this stage
            const qNumPositions = [
                `SELECT count(*) as numPositions FROM v_fixture_information WHERE `,
                `  tournamentId = ${tournamentId} and `,
                `  stage = '${stage}' and `,
                `  groupNumber = ${groupNumber} and `,
                `  category = '${category}'`,
            ].join(' ')
            const { numPositions = 0 } = stage === 'group' ? ((await select(qNumPositions)).data[0] || {}) : { numPositions: 2 }
            const range = [...Array(numPositions).keys()]
            range.forEach(async (position) => {
                const placeHolder = `~${stage}:${groupNumber}/p:${position + 1}`
                const newValue = groupStandings[position]?.team
                const qUpdatePlayoffTeam1 = [
                    `UPDATE fixtures `,
                    `SET team1Id = '${newValue}' `,
                    `WHERE `,
                    ` team1Planned = '${placeHolder}' and `,
                    ` tournamentId = ${tournamentId} and `,
                    ` category = '${category}'`,
                ].join(' ')
                const qUpdatePlayoffTeam2 = [
                    `UPDATE fixtures `,
                    `SET team2Id = '${newValue}' `,
                    `WHERE `,
                    ` team2Planned = '${placeHolder}' and `,
                    ` tournamentId = ${tournamentId} and `,
                    ` category = '${category}'`,
                ].join(' ')
                const qUpdateUmpireTeam = [
                    `UPDATE fixtures `,
                    `SET umpireTeamId = '${newValue}' `,
                    `WHERE `,
                    ` umpireTeamPlanned = '${placeHolder}' and `,
                    ` tournamentId = ${tournamentId} and `,
                    ` category = '${category}'`,
                ].join(' ')
                console.log(qUpdatePlayoffTeam1)
                console.log(qUpdatePlayoffTeam2)
                console.log(qUpdateUmpireTeam)
                await select(qUpdatePlayoffTeam1)
                await select(qUpdatePlayoffTeam2)
                await select(qUpdateUmpireTeam)
            })
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
            await processStageCompletion(id)
            res.json({
                message: 'Score updated successfully.'
            });
        } catch (err) {
            console.log('Error occured', err)
            return res.status(500).json({ error: err.message });
        }
    }

    const cardPlayers = (req, res) => {
        II('Calling API: /api/fixtures/:id/carded')
        const { id } = req.params
        const query = [
            "INSERT INTO cards",
            "(tournament, fixture, playerNumber, playerName, cardColor)",
            "VALUES",
            req.body.map((player) => {
                return `(5, ${id}, ${player.playerNumber}, '${player.playerName}', '${player.playerCard}')`
            }).join(','),
        ].join(' ')
        db.query(query, (err, results) => {
            if (err) {
                console.log('Error occured', err)
                return res.status(500).json({ error: err.message });
            }
            res.json({ data: results });
        });
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
    app.post('/api/fixtures/:id/carded', cardPlayers)
    app.post('/api/fixtures/:id/score', updateScore)
}

