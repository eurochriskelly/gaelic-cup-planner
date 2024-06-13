-- Delete the view if it exists
DROP VIEW IF EXISTS `v_next_up`;

-- Create the view
CREATE ALGORITHM=UNDEFINED 
DEFINER=`root`@`localhost` 
SQL SECURITY DEFINER 
VIEW `v_next_up` AS
WITH RankedFixtures AS (
    SELECT
        tournamentId,
        category,
        pitch,
        scheduledTime,
        startedTime,
        groupNumber AS grp,
        team1,
        team2,
        umpireTeam,
        goals1,
        points1,
        goals2,
        points2,
        id AS matchId,
        'ranked' AS isType,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY scheduledTime) AS rn
    FROM v_fixture_information
    WHERE played = 0
),
RecentPlayedFixtures AS (
    SELECT
        tournamentId,
        category,
        pitch,
        scheduledTime,
        startedTime,
        groupNumber AS grp,
        team1,
        team2,
        umpireTeam,
        goals1,
        points1,
        goals2,
        points2,
        id AS matchId,
        'recent' AS isType,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY startedTime DESC) AS rn
    FROM v_fixture_information
    WHERE played = 1
)
SELECT
    tournamentId,
    category,
    pitch,
    scheduledTime,
    startedTime,
    grp,
    team1,
    team2,
    umpireTeam,
    goals1,
    points1,
    goals2,
    points2,
    matchId,
    isType
FROM RankedFixtures
WHERE rn <= 3
UNION ALL
SELECT
    tournamentId,
    category,
    pitch,
    scheduledTime,
    startedTime,
    grp,
    team1,
    team2,
    umpireTeam,
    goals1,
    points1,
    goals2,
    points2,
    matchId,
    isType
FROM RecentPlayedFixtures
WHERE rn = 1
ORDER BY category, scheduledTime;

