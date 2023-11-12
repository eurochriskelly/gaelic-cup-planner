SELECT t.date, t.id AS id, t.Title as title, t.Location as location, COUNT(f.stage) AS numFixtures
FROM tournaments t
LEFT JOIN fixtures f ON t.id = f.tournamentId
GROUP BY t.id, t.Title, t.Location
