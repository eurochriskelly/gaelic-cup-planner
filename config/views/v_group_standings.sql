SELECT
  category,
  grp,
  team,
  tournamentId,
  SUM(MatchesPlayed) AS MatchesPlayed,
  SUM(Wins) AS Wins,
  SUM(Draws) AS Draws,
  SUM(Losses) AS Losses,
  SUM(PointsFrom) AS PointsFrom,
  SUM(PointsDifference) AS PointsDifference,
  SUM(TotalPoints) AS TotalPoints
FROM (
    	SELECT 
    	  category, 
    	  groupNumber as grp, 
    	  team1Id AS team, 
    	  tournamentId, 
    	  COUNT(*) AS MatchesPlayed,
    	  SUM(CASE WHEN goals1*3 + points1 > goals2*3 + points2 THEN 1 ELSE 0 END) AS Wins,
    	  SUM(CASE WHEN goals1*3 + points1 = goals2*3 + points2 THEN 1 ELSE 0 END) AS Draws,
    	  SUM(CASE WHEN goals1*3 + points1 < goals2*3 + points2 THEN 1 ELSE 0 END) AS Losses,
    	  SUM(goals1*3 + points1) AS PointsFrom,
    	  SUM((goals1*3 + points1) - (goals2*3 + points2)) AS PointsDifference,
    	  SUM(
    	    CASE
    	      WHEN goals1*3 + points1 > goals2*3 + points2 THEN 2
    	      WHEN goals1*3 + points1 = goals2*3 + points2 THEN 1
    	      ELSE 0
    	    END
    	  ) AS TotalPoints
    FROM fixtures
    WHERE stage = 'group'
    GROUP BY category, groupNumber, team1Id, tournamentId

	UNION ALL

	SELECT 
	  category,
      groupNumber as grp,
	  team2Id AS team,
	  tournamentId,
	  COUNT(*) AS MatchesPlayed,
	  SUM(CASE WHEN goals2*3 + points2 > goals1*3 + points1 THEN 1 ELSE 0 END) AS Wins,
	  SUM(CASE WHEN goals2*3 + points2 = goals1*3 + points1 THEN 1 ELSE 0 END) AS Draws,
	  SUM(CASE WHEN goals2*3 + points2 < goals1*3 + points1 THEN 1 ELSE 0 END) AS Losses,
	  SUM(goals2*3 + points2) AS PointsFrom,
	  SUM((goals2*3 + points2) - (goals1*3 + points1)) AS PointsDifference,
	  SUM(
		CASE
		  WHEN goals2*3 + points2 > goals1*3 + points1 THEN 2
		  WHEN goals2*3 + points2 = goals1*3 + points1 THEN 1
		  ELSE 0
		END
	  ) AS TotalPoints
    FROM fixtures
    WHERE stage = 'group'
    GROUP BY category, groupNumber, team2Id, tournamentId
) AS combined
GROUP BY category, grp, team, tournamentId
ORDER BY category DESC, grp, TotalPoints DESC, PointsDifference DESC, PointsFrom DESC;
