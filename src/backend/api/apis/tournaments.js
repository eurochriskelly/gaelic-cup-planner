// api/apis/tournaments.js
const e = require("express");
const { II } = require("../../lib/logging");
const { jsonToCsv, sendXsls } = require("../../lib/utils");

module.exports = (app, db, select) => {
  return {
    // Existing endpoints (unchanged)
    resetTournament: async (req, res) => {
      const { tournamentId } = req.params;
      if (+tournamentId === 1) {
        II(`Calling API: /api/tournaments/${tournamentId}/reset ...`);
        const query = `UPDATE fixtures SET started = NULL, goals1 = NULL, points1 = NULL, goals2 = NULL, points2 = NULL WHERE tournamentId = ${tournamentId};`;
        await select(query);
      } else {
        II(`Only the sandbox tournament can be reset (id=1). You cannot reset tournament [${tournamentId}]`);
      }
    },

    getTournament: async (req, res) => {
      const { tournamentId } = req.params;
      II(`Calling API: /api/tournaments/${tournamentId} ...`);
      let query = `SELECT * FROM tournaments WHERE id = ${tournamentId}`;
      let results = await select(query);
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
      res.json({ data: tournament });
    },

    getTournaments: (req, res) => {
      II("Calling API: /api/tournaments ...");
      const query = `SELECT Id, Date, Title, Location FROM tournaments`;
      db.query(query, (err, results) => {
        if (err) {
          console.log("Error occurred", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ data: results });
      });
    },

    getGroups: (req, res) => {
      const { tournamentId } = req.params;
      II(`Calling API: /api/tournaments/${tournamentId}/groups ...`);
      const query = `SELECT DISTINCT category FROM fixtures where tournamentId = ${tournamentId}`;
      db.query(query, (err, results) => {
        if (err) {
          console.log("Error occurred while getting groups", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ data: results });
      });
    },

    getResults: (req, res) => {
      const { tournamentId, category } = req.params;
      const { format = "json" } = req.query;
      II(`Calling API: /api/tournaments/${tournamentId}/results/${category} ...`);
      const query = `SELECT * FROM v_match_results where tournamentId = ${tournamentId} and category = '${category}'`;
      db.query(query, (err, results) => {
        if (err) {
          console.log("Error occurred while getting groups", err);
          return res.status(500).json({ error: err.message });
        }
        switch (format) {
          case "csv":
            const csv = jsonToCsv(results);
            res.setHeader("Content-Disposition", 'attachment; filename="data.csv"');
            res.set("Content-Type", "text/csv; charset=utf-8");
            res.send(csv);
            break;
          case "xlsx":
          case "xslx":
            sendXsls(results, res, 'results');
            break;
          default:
            res.json({ data: results });
            break;
        }
      });
    },

    getCategories: (req, res) => {
      const { tournamentId } = req.params;
      II(`Calling API: /api/tournaments/${tournamentId}/categories ...`);
      const query = `SELECT * FROM v_categories WHERE tournamentId = '${tournamentId}'`;
      db.query(query, (err, results) => {
        if (err) {
          console.log("Error occurred while getting groups", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({
          data: results.map((result) => ({
            ...result,
            brackets: result.brackets.split(",").map((x) => x.trim()),
          })),
        });
      });
    },

    getTeams: (req, res) => {
      II("Calling API: /api/tournaments/:tournamentId/group/:group_id/teams ...");
      const { tournamentId, group_id } = req.params;
      const g = group_id.replace(/_/g, " ");
      const query = `SELECT id, teamName, category, groupLetter from teams where tournamentId = ${tournamentId} and category = '${g}'`;
      db.query(query, (err, results) => {
        if (err) {
          console.log("Error occurred while getting teams", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ data: results });
      });
    },

    // New endpoints
    getRecentMatches: async (req, res) => {
      const { id } = req.params;
      II(`Calling API: /api/tournaments/${id}/recent-matches`);
      try {
        const countQuery = `SELECT count(*) as count FROM EuroTourno.v_fixture_information WHERE tournamentId = ? AND goals1 IS NOT NULL`;
        const matchQuery = `SELECT id, DATE_FORMAT(DATE_ADD(started, INTERVAL 2 HOUR), '%H:%i') as start, pitch, groupNumber as grp, stage, category as competition, team1, 
          CONCAT(goals1, '-', LPAD(points1, 2, '0'), ' (', LPAD(IF(goals1 IS NOT NULL AND points1 IS NOT NULL, goals1 * 3 + points1, 'N/A'), 2, '0'), ')') AS score1, 
          team2, CONCAT(goals2, '-', LPAD(points2, 2, '0'), ' (', LPAD(IF(goals2 IS NOT NULL AND points2 IS NOT NULL, goals2 * 3 + points2, 'N/A'), 2, '0'), ')') AS score2, 
          umpireTeam 
          FROM EuroTourno.v_fixture_information WHERE tournamentId = ? AND started IS NOT NULL ORDER BY started DESC LIMIT 12`;
        const countResult = await select(countQuery.replace("?", id));
        const matchResult = await select(matchQuery.replace("?", id));
        res.json({ matchCount: countResult.data[0].count, matches: matchResult.data });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    getGroupFixtures: async (req, res) => {
      const { id } = req.params;
      II(`Calling API: /api/tournaments/${id}/group-fixtures`);
      const query = `SELECT id, category, groupNumber AS g, pitch, scheduledTime, team1, goals1, points1, team2, goals2, points2, umpireTeam, 
        IF(started IS NULL, 'false', 'true') AS started 
        FROM EuroTourno.v_fixture_information WHERE tournamentId = ? AND stage = 'group' ORDER BY category, scheduledTime`;
      try {
        const result = await select(query.replace("?", id));
        res.json(result.data);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    getGroupStandings: async (req, res) => {
      const { id } = req.params;
      II(`Calling API: /api/tournaments/${id}/group-standings`);
      try {
        const groupsQuery = `SELECT DISTINCT grp as gnum, category FROM EuroTourno.v_group_standings WHERE tournamentId = ?`;
        const standingsQuery = `SELECT category, grp, team, tournamentId, MatchesPlayed, Wins, Draws, Losses, PointsFrom, PointsDifference, TotalPoints 
          FROM EuroTourno.v_group_standings WHERE tournamentId = ? AND category = ? AND grp LIKE ? 
          ORDER BY TotalPoints DESC, PointsDifference DESC, PointsFrom DESC`;
        const groups = await select(groupsQuery.replace("?", id));
        const standings = {};
        for (const { gnum, category } of groups.data) {
          const result = await select(standingsQuery.replace("?", id).replace("?", category).replace("?", gnum));
          standings[category] = standings[category] || {};
          standings[category][gnum] = result.data;
        }
        res.json(standings);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    getKnockoutFixtures: async (req, res) => {
      const { id } = req.params;
      II(`Calling API: /api/tournaments/${id}/knockout-fixtures`);
      const query = `SELECT id, category, stage, pitch, scheduledTime, team1, goals1, points1, team2, goals2, points2, umpireTeam, 
        IF(started IS NULL, 'false', 'true') AS started 
        FROM EuroTourno.v_fixture_information WHERE tournamentId = ? AND stage != 'group' ORDER BY category, scheduledTime`;
      try {
        const result = await select(query.replace("?", id));
        res.json(result.data);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    getFinalsResults: async (req, res) => {
      const { id } = req.params;
      II(`Calling API: /api/tournaments/${id}/finals-results`);
      const query = `SELECT category, REPLACE(stage, '_finals', '') AS division, team1, goals1, points1, team2, goals2, points2, 
        CASE WHEN (goals1 * 3 + points1) > (goals2 * 3 + points2) THEN team1 
             WHEN (goals1 * 3 + points1) < (goals2 * 3 + points2) THEN team2 
             ELSE 'Draw' END AS winner 
        FROM v_fixture_information WHERE tournamentId = ? AND stage LIKE '%finals' ORDER BY category`;
      try {
        const result = await select(query.replace("?", id));
        res.json(result.data);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    getAllMatches: async (req, res) => {
      const { id } = req.params;
      II(`Calling API: /api/tournaments/${id}/all-matches`);
      const query = `SELECT id, category, groupNumber AS grp, stage, pitch, scheduledTime, team1, goals1, points1, team2, goals2, points2, umpireTeam, 
        IF(started IS NULL, 'false', 'true') AS started 
        FROM EuroTourno.v_fixture_information WHERE tournamentId = ? ORDER BY scheduledTime`;
      try {
        const result = await select(query.replace("?", id));
        res.json(result.data);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  };
};
