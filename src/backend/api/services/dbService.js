const { promisify } = require("util");
const { mysqlCurrentTime } = require("../../lib/utils");

module.exports = (db) => {
  const query = promisify(db.query).bind(db);

  return {
    // Tournament CRUD (New)
    createTournament: async ({ title, date, location, lat, lon }) => {
      const result = await query(
        `INSERT INTO tournaments (Title, Date, Location, Lat, Lon) VALUES (?, ?, ?, ?, ?)`,
        [title, date, location, lat, lon]
      );
      return result.insertId;
    },

    getTournaments: async () => {
      return await query(`SELECT Id, Date, Title, Location FROM tournaments`);
    },

    getTournament: async (id) => {
      const tournamentRows = await query(`SELECT id, Date, Title, Location FROM tournaments WHERE Id = ?`, [id]);
      if (!tournamentRows.length) return null;
      const tournament = tournamentRows[0];
      const [groups, pitches] = await Promise.all([
        query(`SELECT category, grp, team FROM v_group_standings WHERE tournamentId = ?`, [id]),
        query(`SELECT id, pitch, location FROM pitches WHERE tournamentId = ?`, [id]),
      ]);
      tournament.groups = groups;
      tournament.pitches = pitches;
      return tournament;
    },

    updateTournament: async (id, { title, date, location, lat, lon }) => {
      await query(
        `UPDATE tournaments SET Title = ?, Date = ?, Location = ?, Lat = ?, Lon = ? WHERE id = ?`,
        [title, date, location, lat, lon, id]
      );
    },

    deleteTournament: async (id) => {
      await query(`DELETE FROM tournaments WHERE id = ?`, [id]);
    },

    resetTournament: async (id) => {
      await query(
        `UPDATE fixtures SET started = NULL, goals1 = NULL, points1 = NULL, goals2 = NULL, points2 = NULL WHERE tournamentId = ?`,
        [id]
      );
    },

    // Tournament Methods (Original + Updates)
    getTournamentGroups: async (id) => {
      return await query(`SELECT DISTINCT category FROM fixtures WHERE tournamentId = ?`, [id]);
    },

    getTournamentResults: async (id, category) => {
      return await query(
        `SELECT * FROM v_match_results WHERE tournamentId = ? AND category = ?`,
        [id, category]
      );
    },

    getTournamentCategories: async (id) => {
      const rows = await query(`SELECT * FROM v_categories WHERE tournamentId = ?`, [id]);
      return rows.map(row => ({
        ...row,
        brackets: row.brackets.split(",").map(x => x.trim())
      }));
    },

    getFixture: async (fixtureId) => {
      const query = `SELECT * FROM fixtures WHERE id = ${db.escape(fixtureId)}`;
      return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        });
      });
    },

    getStartedMatchCount: async (id) => {
      const result = await query(
        `SELECT COUNT(*) as count FROM v_fixture_information WHERE tournamentId = ? AND goals1 IS NOT NULL`,
        [id]
      );
      return result[0].count;
    },

    getRecentMatches: async (id) => {
      return await query(
        `SELECT id, DATE_FORMAT(DATE_ADD(started, INTERVAL 2 HOUR), '%H:%i') as start, pitch, 
          groupNumber as grp, stage, category as competition, team1, 
          CONCAT(goals1, '-', LPAD(points1, 2, '0'), ' (', LPAD(IF(goals1 IS NOT NULL AND points1 IS NOT NULL, goals1 * 3 + points1, 'N/A'), 2, '0'), ')') AS score1, 
                team2, CONCAT(goals2, '-', LPAD(points2, 2, '0'), ' (', LPAD(IF(goals2 IS NOT NULL AND points2 IS NOT NULL, goals2 * 3 + points2, 'N/A'), 2, '0'), ')') AS score2, umpireTeam 
         FROM v_fixture_information 
         WHERE tournamentId = ? AND started IS NOT NULL 
         ORDER BY started DESC 
         LIMIT 12`,
        [id]
      );
    },

    getGroupFixtures: async (id) => {
      return await query(
        `SELECT id, category, groupNumber AS g, pitch, scheduledTime, team1, goals1, points1, team2, goals2, points2, umpireTeam, 
                IF(started IS NULL, 'false', 'true') AS started 
         FROM v_fixture_information 
         WHERE tournamentId = ? AND stage = 'group' 
         ORDER BY category, scheduledTime`,
        [id]
      );
    },

    getGroupStandings: async (id) => {
      const groups = await query(
        `SELECT DISTINCT grp as gnum, category FROM v_group_standings WHERE tournamentId = ?`,
        [id]
      );
      const standings = {};
      for (const { gnum, category } of groups) {
        const rows = await query(
          `SELECT category, grp, team, tournamentId, MatchesPlayed, Wins, Draws, Losses, PointsFrom, PointsDifference, TotalPoints 
           FROM v_group_standings 
           WHERE tournamentId = ? AND category = ? AND grp LIKE ? 
           ORDER BY TotalPoints DESC, PointsDifference DESC, PointsFrom DESC`,
          [id, category, gnum]
        );
        standings[category] = standings[category] || {};
        standings[category][gnum] = rows;
      }
      return standings;
    },

    getKnockoutFixtures: async (id) => {
      return await query(
        `SELECT id, category, stage, pitch, scheduledTime, team1, goals1, points1, team2, goals2, points2, umpireTeam, 
                IF(started IS NULL, 'false', 'true') AS started 
         FROM v_fixture_information 
         WHERE tournamentId = ? AND stage != 'group' 
         ORDER BY category, scheduledTime`,
        [id]
      );
    },

    getFinalsResults: async (id) => {
      return await query(
        `SELECT category, REPLACE(stage, '_finals', '') AS division, team1, goals1, points1, team2, goals2, points2, 
                CASE WHEN (goals1 * 3 + points1) > (goals2 * 3 + points2) THEN team1 
                     WHEN (goals1 * 3 + points1) < (goals2 * 3 + points2) THEN team2 
                     ELSE 'Draw' END AS winner 
         FROM v_fixture_information 
         WHERE tournamentId = ? AND stage LIKE '%finals' 
         ORDER BY category`,
        [id]
      );
    },

    getAllMatches: async (id) => {
      return await query(
        `SELECT id, category, groupNumber AS grp, stage, pitch, scheduledTime, 
                team1, goals1, points1, team2, goals2, points2, umpireTeam as umpireTeam, 
                IF(started IS NULL, 'false', 'true') AS started 
         FROM v_fixture_information 
         WHERE tournamentId = ? 
         ORDER BY scheduledTime`,
        [id]
      );
    },

    // Squads CRUD (Updated from teams)
    createSquad: async (tournamentId, { teamName, groupLetter, category, teamSheetSubmitted, notes }) => {
      const result = await query(
        `INSERT INTO squads (teamName, groupLetter, category, teamSheetSubmitted, notes, tournamentId) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [teamName, groupLetter, category, teamSheetSubmitted || false, notes, tournamentId]
      );
      return result.insertId;
    },

    getSquads: async (tournamentId) => {
      return await query(`SELECT * FROM squads WHERE tournamentId = ?`, [tournamentId]);
    },

    getSquad: async (tournamentId, id) => {
      const rows = await query(`SELECT * FROM squads WHERE tournamentId = ? AND id = ?`, [tournamentId, id]);
      return rows[0] || null;
    },

    updateSquad: async (id, { teamName, groupLetter, category, teamSheetSubmitted, notes }) => {
      await query(
        `UPDATE squads SET teamName = ?, groupLetter = ?, category = ?, teamSheetSubmitted = ?, notes = ? WHERE id = ?`,
        [teamName, groupLetter, category, teamSheetSubmitted || false, notes, id]
      );
    },

    deleteSquad: async (id) => {
      await query(`DELETE FROM squads WHERE id = ?`, [id]);
    },

    // Players CRUD (New)
    createPlayer: async (squadId, { firstName, secondName, dateOfBirth, foirreannId }) => {
      const result = await query(
        `INSERT INTO players (firstName, secondName, dateOfBirth, foirreannId, teamId) 
         VALUES (?, ?, ?, ?, ?)`,
        [firstName, secondName, dateOfBirth, foirreannId, squadId]
      );
      return result.insertId;
    },

    getPlayers: async (squadId) => {
      return await query(`SELECT * FROM players WHERE teamId = ?`, [squadId]);
    },

    getPlayer: async (id) => {
      const rows = await query(`SELECT * FROM players WHERE id = ?`, [id]);
      return rows[0] || null;
    },

    updatePlayer: async (id, { firstName, secondName, dateOfBirth, foirreannId }) => {
      await query(
        `UPDATE players SET firstName = ?, secondName = ?, dateOfBirth = ?, foirreannId = ? WHERE id = ?`,
        [firstName, secondName, dateOfBirth, foirreannId, id]
      );
    },

    deletePlayer: async (id) => {
      await query(`DELETE FROM players WHERE id = ?`, [id]);
    },

    // Fixtures (Original + Schema Updates)
    getFixturesByPitch: async (tournamentId, pitch) => {
      let where = `WHERE tournamentId = ?`;
      if (pitch) where += ` AND pitch = ?`;
      return await query(`SELECT * FROM v_fixture_information ${where}`, pitch ? [tournamentId, pitch] : [tournamentId]);
    },

    getNextFixtures: async (tournamentId) => {
      return await query(
        `SELECT * FROM v_next_up WHERE tournamentId = ? ORDER BY scheduledTime ASC`,
        [tournamentId]
      );
    },

    rewindLatestFixture: async (tournamentId) => {
      const latest = await query(
        `SELECT id, category, stage FROM fixtures WHERE tournamentId = ? AND started IS NOT NULL ORDER BY started DESC LIMIT 1`,
        [tournamentId]
      );
      if (!latest.length) return null;
      const { id } = latest[0];
      await query(
        `UPDATE fixtures SET goals1 = NULL, points1 = NULL, goals2 = NULL, points2 = NULL, started = NULL WHERE id = ?`,
        [id]
      );
      return latest[0];
    },

    startFixture: async (id) => {
      const mysqlTimestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
      return await query(
        `UPDATE fixtures SET started = ? WHERE id = ?`,
        [mysqlTimestamp, id]
      );
    },

    updateScore: async (id, team1, team2, tournamentId) => {
      const t = mysqlCurrentTime();
      await query(
        `UPDATE fixtures SET goals1 = ?, points1 = ?, goals2 = ?, points2 = ?, ended = ? WHERE id = ?`,
        [team1.goals, team1.points, team2.goals, team2.points, t, id]
      );
      // Add processStageCompletion, etc., if needed from your original logic
    },

    cardPlayers: async (tournamentId, fixtureId, cards) => {
      const values = cards.map(c => 
        `(${tournamentId}, ${fixtureId}, ${c.playerId}, '${c.cardColor}')`
      ).join(",");
      return await query(
        `INSERT INTO cards (tournamentId, fixtureId, playerId, cardColor) VALUES ${values}`
      );
    },

    getCardedPlayers: async (tournamentId) => {
      return await query(
        `SELECT c.playerId, p.firstName, p.secondName, c.team, c.cardColor 
         FROM cards c 
         JOIN players p ON c.playerId = p.id 
         WHERE c.tournamentId = ? 
         ORDER BY c.team, p.firstName`,
        [tournamentId]
      );
    },

    getMatchesByPitch: async (tournamentId) => {
      return await query(
        `SELECT id, pitch, stage, scheduledTime, category, team1, goals1, points1, team2, goals2, points2, umpireTeam, 
                IF(started IS NULL, 'false', 'true') AS started 
         FROM v_fixture_information 
         WHERE tournamentId = ? 
         ORDER BY pitch, scheduledTime`,
        [tournamentId]
      );
    },

    // General (Original)
    listPitches: async (tournamentId) => {
      const pitchEvents = await query(
        `SELECT * FROM v_pitch_events WHERE tournamentId = ?`,
        [tournamentId]
      );
      if (pitchEvents.length) return pitchEvents;
      return await query(`SELECT * FROM pitches WHERE tournamentId = ?`, [tournamentId]);
    },

    listStandings: async (tournamentId, category) => {
      const extra = category ? ` AND category = ?` : "";
      const params = category ? [tournamentId, category] : [tournamentId];
      const [groups, standings] = await Promise.all([
        query(`SELECT DISTINCT category FROM v_group_standings WHERE tournamentId = ? ${extra}`, params),
        query(`SELECT * FROM v_group_standings WHERE tournamentId = ? ${extra}`, params)
      ]);
      return { groups: groups.map(g => g.category), data: standings };
    },

    // Regions (Original)
    listRegions: async () => {
      const rows = await query(
        `SELECT DISTINCT CASE WHEN subregion IS NOT NULL AND subregion <> '' 
         THEN CONCAT(region, '%', subregion) ELSE region END AS formatted_region 
         FROM clubs`
      );
      return rows.map(x => x.formatted_region);
    },

    listRegionInfo: async (region, { sex, sport, level }) => {
      const { region: reg, subregion } = splitRegion(region);
      let constraints = [`region = ?`];
      const params = [reg];
      if (subregion) {
        constraints.push(`subregion = ?`);
        params.push(subregion);
      }
      if (sex) constraints.push(sex === "male" ? `category IN ('gaa', 'hurling')` : `category IN ('lgfa', 'camogie')`);
      if (sport) {
        const sportMap = {
          hurling: `'hurling', 'camogie', 'youthhurling'`,
          football: `'gaa', 'lgfa', 'youthfootball'`,
          handball: `'handball'`,
          rounders: `'rounders'`,
        };
        if (sportMap[sport]) constraints.push(`category IN (${sportMap[sport]})`);
      }
      if (level) constraints.push(level === "youth" ? `category IN ('youthhurling', 'youthfootball')` : `category IN ('gaa', 'lgfa', 'hurling', 'camogie', 'handball', 'rounders')`);
      const rows = await query(
        `SELECT * FROM v_club_teams WHERE ${constraints.join(" AND ")}`,
        params
      );
      return { header: { count: rows.length, region: reg, subregion }, data: rows };
    },

    // Auth (Original)
    login: async (email, password) => {
      const users = await query(
        `SELECT * FROM sec_users WHERE Email = ? AND Pass = ? AND IsActive = 1`,
        [email, password] // Hash in production
      );
      if (!users.length) throw new Error("Invalid credentials");
      const user = users[0];
      await query(`UPDATE sec_users SET LastAuthenticated = CURDATE() WHERE id = ?`, [user.id]);
      return { id: user.id, email: user.Email };
    },
  };
};

function splitRegion(rIn) {
  const parts = rIn.split('%');
  return { region: parts[0], subregion: parts.length > 1 ? parts[1] : null };
}
