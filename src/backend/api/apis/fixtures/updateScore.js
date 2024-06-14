const { II } = require("../../../lib/logging");
const { mysqlCurrentTime } = require("../../../lib/utils");
const { calculateRankings } = require('./queries');

/* Update the score
 * 1. Update the score
 * 2. Check if the stage is complete
 *    2.1 If yes, update the playoff fixtures based on new information
 */

module.exports = (app, db, select) => ({
  testing: async (req, res) => {
    const info = await processSameRankOnGroupCompletion(11, "FemmesD1", select);
    res.json({ message: "ok", info });
  },
  rankings: async (req, res) => {},
  updateScore: async (req, res) => {
    const { id, tournamentId } = req.params;
    II(`Calling API: /api/tournaments/${tournamentId}/fixtures/${id}/score`);
    try {
      const { team1, team2 } = req.body;
      const team1Score = team1.goals * 3 + team1.points;
      const team2Score = team2.goals * 3 + team2.points;
      // fixme: add the time
      const t = mysqlCurrentTime();
      const updateQuery = [
        "UPDATE fixtures",
        `SET goals1 = '${team1.goals}', points1 = '${team1.points}', `,
        `    goals2 = '${team2.goals}', points2 = '${team2.points}', `,
        `    ended = '${t}' `,
        `WHERE id = ${id};`,
      ].join(" ");
      console.log("score update", updateQuery);
      await select(updateQuery);
      // TODO:: These queries can be run in parallel or in a combined statement
      await processStageCompletion(id, select);
      await processSameRankOnGroupCompletion(
        tournamentId,
        team1.category,
        select
      );
      await processAnyMatchDependentFixtures(
        {
          name: team1.name,
          category: team1.category,
          position: team1Score > team2Score ? 1 : 2,
          matchId: id,
          tournamentId,
        },
        select
      );
      await processAnyMatchDependentFixtures(
        {
          name: team2.name,
          category: team2.category,
          position: team1Score > team2Score ? 2 : 1,
          matchId: id,
          tournamentId,
        },
        select
      );
      res.json({ message: "Score updated successfully." });
    } catch (err) {
      console.log("Error occured", err);
      return res.status(500).json({ error: err.message });
    }
  },
});

/**
 *
 */
async function processSameRankOnGroupCompletion(
  tournamentId,
  category,
  select
) {
  II(`Processing same rank in group `);
  let q = `
    select count(*) as count from fixtures 
    where tournamentId=${tournamentId} and 
      category = "${category}" and started is null and ( 
      team1Id like '~rankgrp:%' or 
      team2Id like '~rankgrp:%' or 
      umpireTeamId like '~rankgrp:%'
    )`;
  const rankgrpRemaining = +(await select(q)).data[0].count > 0;
  q = `
    select count(*) as count from fixtures
    where tournamentId=${tournamentId} and 
      category = '${category}' and stage = 'group' and
      goals1 is null
    `;
  const groupGamesFinished = +(await select(q)).data[0].count === 0;
  if (rankgrpRemaining && groupGamesFinished) {
    const rankings = await calculateRankings(tournamentId, category, select);
    // Find rankings that need replacing
    q = `
      select distinct * from (
        select team1Id from fixtures where tournamentId = ${tournamentId} and category = '${category}' and team1Id like '~rankgrp:%'
          union
        select team2Id from fixtures where tournamentId = ${tournamentId} and category = '${category}' and team2Id like '~rankgrp:%'
          union
        select umpireTeamId from fixtures where tournamentId = ${tournamentId} and category = '${category}' and umpireTeamId like '~rankgrp:%'
      ) x
     `;
    const replaceList = (await select(q)).data.map((x) => x.team1Id);
    replaceList.forEach(async (r) => {
      const parts = r.split("/");
      const place = +parts[0].split(":").pop();
      const position = +parts[1].split(":").pop();
      const item = rankings.filter((x) => x.place === place)[position - 1];
      const qq = (x, placeHolder, team) => {
        const query = `
          UPDATE fixtures
          SET ${x}Id = '${team}'
          WHERE ${x}Planned = '${placeHolder}' and
            tournamentId = ${tournamentId} and 
            category = '${category}'`;
        console.log(query);
        return query;
      };
      await select(qq("team1", r, item.team));
      await select(qq("team2", r, item.team));
      await select(qq("umpireTeam", r, item.team));
    });
  }

  return {
    rankgrpRemaining,
    groupGamesFinished,
  };
}

/**
 * Process dependencies having ~match in the name1
 */
async function processAnyMatchDependentFixtures(teamInfo, select) {
  // Any time a match is updated attempt to update any teams were dependent on the outcome
  const { name, position, matchId, category, tournamentId } = teamInfo;
  const placeHolder = `~match:${matchId}/p:${position}`;
  const qAnyMatchWinner = (x) => {
    const parts = placeHolder.split('&');
    let cat = category, ph = placeHolder;
    if (parts.length === 2) {
      ph = parts[0];
      cat = parts[1];
    }
    return [
      `UPDATE fixtures `,
      `SET ${x}Id = '${name}' `,
      `WHERE `,
      `  ${x}Planned = '${ph}' and `,
      `  tournamentId = ${tournamentId} and `,
      `  category = '${cat}'`,
    ].join(" ");
  }
  console.log(
    "Updating fixtures depending out match outcome for match [",
    matchId,
    "]"
  );
  console.log(qAnyMatchWinner("team1"));
  console.log(qAnyMatchWinner("team2"));
  console.log(qAnyMatchWinner("umpireTeam"));
  await select(qAnyMatchWinner("team1"));
  await select(qAnyMatchWinner("team2"));
  await select(qAnyMatchWinner("umpireTeam"));
}

async function processStageCompletion(fixtureId, select) {
  // FIXME: attempt to update after every match if it's after group stages
  const selQuery = `SELECT tournamentId, stage, groupNumber, category FROM fixtures WHERE id = ${fixtureId}`;
  const data = await select(selQuery);
  const { tournamentId, stage, groupNumber, category } = data?.data[0];
  const completedQuery = [
    `SELECT count(*) as remaining FROM fixtures WHERE `,
    `  tournamentId = ${tournamentId} and `,
    `  stage = '${stage}' and `,
    `  groupNumber = ${groupNumber} and `,
    `  category = '${category}' and `,
    `  goals1 is null`,
  ].join(" ");
  const remainingMatchesInStage = +(await select(completedQuery))?.data[0]?.remaining;
  // If the stage has been completed, we will attempt to update what needs to be updated
  if (!remainingMatchesInStage) {
    console.log(`Stage [${stage}] has been completed ... Updating calculated teams`);
    const qGroupStandings = [
      `SELECT * FROM v_group_standings where `,
      `  tournamentId = ${tournamentId} and `,
      `  grp = ${groupNumber} and `,
      `  category = '${category}'`,
    ].join(" ");
    const groupStandings = (await select(qGroupStandings)).data;
    // Loop over each team in stage/groupNumber and update any playoff fixtures
    const qNumPositions = [
      `SELECT count(*) as numPositions FROM v_fixture_information WHERE `,
      `  tournamentId = ${tournamentId} and `,
      `  stage = '${stage}' and `,
      `  groupNumber = ${groupNumber} and `,
      `  category = '${category}'`,
    ].join(" ");
    const { numPositions = 0 } = stage === "group"
      ? (await select(qNumPositions)).data[0] || {}
      : { numPositions: 2 };
    const range = [...Array(numPositions).keys()];
    range.forEach(async (position) => {
      const placeHolder = `~${stage}:${groupNumber}/p:${position + 1}`;
      const newValue = groupStandings[position]?.team;
      const q = (t) => {
        const parts = placeHolder.split('&');
        let cat = category, ph = placeHolder;
        if (parts.length === 2) {
          ph = parts[0];
          cat = parts[1];
        }
        const sql = [
          `UPDATE fixtures SET ${t}Id = '${newValue}' `,
          `WHERE `,
          ` ${t}Planned = '${ph}' and `,
          ` tournamentId = ${tournamentId} and `,
          ` category = '${cat}'`,
        ].join(" ");
        console.log(sql);
        return sql;
      };
      console.log("Updating playoff fixtures");
      await select(q("team1"));
      await select(q("team2"));
      await select(q("umpireTeam"));
    });
    return true;
  }

  console.log(
    `Stage [${stage}/${groupNumber}] for [${category}] has [${remainingMatchesInStage}] remaining matches.`
  );
  return false;
}

