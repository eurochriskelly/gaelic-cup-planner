CREATE VIEW v_match_results AS
SELECT 
    tournamentId,
    category,
    SUBSTRING(CAST(id AS CHAR), -2) as id,
    CASE 
        WHEN (goals1*3 + points1) > (goals2*3 + points2) THEN '🎗️'
        ELSE ''
    END as w1,
    team1Id as team1,
    CONCAT(goals1, '-', LPAD(points1, 2, '0'), ' (', (goals1*3+points1), ')') as score1,
    stage,
    CONCAT(goals2, '-', LPAD(points2, 2, '0'), ' (', (goals2*3+points2), ')') as score2,
    team2Id as team2,
    CASE 
        WHEN (goals2*3 + points2) > (goals1*3 + points1) THEN '🎗️'
        ELSE ''
    END as w2
FROM 
    EuroTourno.fixtures 
WHERE 
    tournamentId=10 
    AND category = 'Hurling';

