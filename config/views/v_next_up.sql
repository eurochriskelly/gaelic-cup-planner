-- Delete the view if it exists
DROP VIEW IF EXISTS `v_next_up`;

-- Create the view
CREATE ALGORITHM=UNDEFINED 
DEFINER=`root`@`localhost` 
SQL SECURITY DEFINER 
VIEW `v_next_up` AS
WITH RankedFixtures AS (
    SELECT 
        v_fixture_information.tournamentId AS tournamentId,
        v_fixture_information.category AS category,
        v_fixture_information.pitch AS pitch,
        v_fixture_information.scheduledTime AS scheduledTime,
        v_fixture_information.startedTime AS startedTime,
        v_fixture_information.groupNumber AS grp,
        v_fixture_information.team1 AS team1,
        v_fixture_information.team2 AS team2,
        v_fixture_information.umpireTeam AS umpireTeam,
        v_fixture_information.goals1 AS goals1,
        v_fixture_information.points1 AS points1,
        v_fixture_information.goals2 AS goals2,
        v_fixture_information.points2 AS points2,
        ROW_NUMBER() OVER (PARTITION BY v_fixture_information.category ORDER BY v_fixture_information.scheduledTime) AS rn
    FROM v_fixture_information
    WHERE v_fixture_information.played = 0
), 
RecentPlayedFixtures AS (
    SELECT 
        v_fixture_information.tournamentId AS tournamentId,
        v_fixture_information.category AS category,
        v_fixture_information.pitch AS pitch,
        v_fixture_information.scheduledTime AS scheduledTime,
        v_fixture_information.startedTime AS startedTime,
        v_fixture_information.groupNumber AS grp,
        v_fixture_information.team1 AS team1,
        v_fixture_information.team2 AS team2,
        v_fixture_information.umpireTeam AS umpireTeam,
        v_fixture_information.goals1 AS goals1,
        v_fixture_information.points1 AS points1,
        v_fixture_information.goals2 AS goals2,
        v_fixture_information.points2 AS points2,
        ROW_NUMBER() OVER (PARTITION BY v_fixture_information.category ORDER BY v_fixture_information.startedTime DESC) AS rn
    FROM v_fixture_information
    WHERE v_fixture_information.played = 1
)
SELECT 
    RankedFixtures.tournamentId AS tournamentId,
    RankedFixtures.category AS category,
    RankedFixtures.pitch AS pitch,
    RankedFixtures.scheduledTime AS scheduledTime,
    RankedFixtures.startedTime AS startedTime,
    RankedFixtures.grp AS grp,
    RankedFixtures.team1 AS team1,
    RankedFixtures.team2 AS team2,
    RankedFixtures.umpireTeam AS umpireTeam,
    RankedFixtures.goals1 AS goals1,
    RankedFixtures.points1 AS points1,
    RankedFixtures.goals2 AS goals2,
    RankedFixtures.points2 AS points2
FROM RankedFixtures
WHERE RankedFixtures.rn <= 3

UNION ALL

SELECT 
    RecentPlayedFixtures.tournamentId AS tournamentId,
    RecentPlayedFixtures.category AS category,
    RecentPlayedFixtures.pitch AS pitch,
    RecentPlayedFixtures.scheduledTime AS scheduledTime,
    RecentPlayedFixtures.startedTime AS startedTime,
    RecentPlayedFixtures.grp AS grp,
    RecentPlayedFixtures.team1 AS team1,
    RecentPlayedFixtures.team2 AS team2,
    RecentPlayedFixtures.umpireTeam AS umpireTeam,
    RecentPlayedFixtures.goals1 AS goals1,
    RecentPlayedFixtures.points1 AS points1,
    RecentPlayedFixtures.goals2 AS goals2,
    RecentPlayedFixtures.points2 AS points2
FROM RecentPlayedFixtures
WHERE RecentPlayedFixtures.rn = 1
ORDER BY category, scheduledTime;


