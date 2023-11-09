select 
	id, tournamentId,
    category, pitch, stage,
    scheduled,
    TIME_FORMAT(scheduled, '%H:%i') as scheduledTime,
    started,
    TIME_FORMAT(started, '%H:%i') as startedTime,
	team1Id as team1,
    goals1, points1,
    team2Id as team2,
    goals2, points2,
    umpireTeamId as umpireTeam,
    CASE
		WHEN goals1 IS NOT NULL AND points1 IS NOT NULL AND goals2 IS NOT NULL AND points2 IS NOT NULL THEN TRUE
		ELSE FALSE
	END AS played   
from fixtures
order by scheduled



