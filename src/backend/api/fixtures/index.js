const { II, DD, EE } = require('../../lib/logging')

// FIXME: Please pass tournament back
const TOURN_ID = 7;

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
                console.log('Updating playoff fixtures')
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

    const processAnyMatchDependentFixtures = async (teamInfo) => {
        // Any time a match is updated attempt to update any teams were dependent on the outcome
        const { name, position, matchId, category, tournamentId } = teamInfo
        const placeHolder = `~match:${matchId}/p:${position}`
        const qAnyMatchWinner = x => [
            `UPDATE fixtures `,
            `SET ${x}Id = '${name}' `,
            `WHERE `,
            `  ${x}Planned = '${placeHolder}' and `,
            `  tournamentId = ${tournamentId} and `,
            `  category = '${category}'`,
        ].join(' ');
        console.log('Updating fixtures depending out match outcome for match [', matchId, ']')
        console.log(qAnyMatchWinner('team1'))
        console.log(qAnyMatchWinner('team2'))
        console.log(qAnyMatchWinner('umpireTeam'))
        await select(qAnyMatchWinner('team1'))
        await select(qAnyMatchWinner('team2'))
        await select(qAnyMatchWinner('umpireTeam'))
    }
        

    /* Update the score
     * 1. Update the score
     * 2. Check if the stage is complete
     *    2.1 If yes, update the playoff fixtures based on new information
     */
    const updateScore = async (req, res) => {
        const { id } = req.params
        II('Calling API: /api/fixtures/' + id + '/score')
        try {
            console.log('Body contains the following')
            console.log(req.body)
            const { team1, team2 } = req.body
            const team1Score = team1.goals*3 + team1.points
            const team2Score = team2.goals*3 + team2.points
            const updateQuery = [
                "UPDATE fixtures",
                `SET goals1 = '${team1.goals}', points1 = '${team1.points}', `,
                `    goals2 = '${team2.goals}', points2 = '${team2.points}'`,
                `WHERE id = ${id};`,
            ].join(' ')
            console.log('score update', updateQuery)
            await select(updateQuery)
            // TODO:: These queries can be run in parallel or in a combined statement
            await processStageCompletion(id)
            await processAnyMatchDependentFixtures({
                name: team1.name,
                category: team1.category,
                position: (team1Score > team2Score) ? 1 : 2,
                matchId: id,
                tournamentId: TOURN_ID
            })
            await processAnyMatchDependentFixtures({
                name: team2.name,
                category: team2.category,
                position: (team1Score > team2Score) ? 2 : 1,
                matchId: id,
                tournamentId: TOURN_ID
            })
            res.json({ message: 'Score updated successfully.' });
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
                return `(${TOURN_ID}, ${id}, ${player.playerNumber}, '${player.playerName}', '${player.playerCard}')`
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

