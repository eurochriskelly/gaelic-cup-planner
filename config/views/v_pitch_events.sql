SELECT 
  pi.pitch, 
  pi.location, 
  pi.type,
  vfi.tournamentId,
  vfi.category, 
  vfi.team1, 
  vfi.team2, 
  vfi.startedTime, 
  vfi.scheduledTime
FROM 
  pitches pi
LEFT JOIN (
  SELECT 
    tournamentId,
    pitch, 
    category, 
    team1, 
    team2, 
    startedTime, 
    scheduledTime
  FROM 
    v_fixture_information 
  WHERE 
    played = 0 AND 
    scheduledTime = (
      SELECT MIN(scheduledTime)
      FROM v_fixture_information vfi2
      WHERE vfi2.pitch = v_fixture_information.pitch AND 
            vfi2.played = 0
    )
) as vfi
ON 
  pi.pitch = vfi.pitch
ORDER BY 
  vfi.scheduledtime IS NULL,
  vfi.scheduledTime ASC,
  pitch
