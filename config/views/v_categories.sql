DROP VIEW IF EXISTS v_categories;

CREATE VIEW v_categories AS
SELECT
    tournamentId,
    category,
    stage,
    COUNT(*) AS totalGames,
    SUM(CASE WHEN started IS NOT NULL THEN 1 ELSE 0 END) AS currentGame,
    GROUP_CONCAT(DISTINCT bracket ORDER BY bracket SEPARATOR ', ') AS brackets
FROM (
    SELECT 
        tournamentId,
        category,
        stage,
        started,
        CASE 
            WHEN stage IN ('playoffs', 'finals', 'semis', 'runnerup', 'quarters', 'eights') THEN 'cup'
            WHEN stage = 'group' THEN 'plate'
            ELSE 'shield'
        END AS bracket
    FROM fixtures
) AS subquery
GROUP BY tournamentId, category, stage
ORDER BY tournamentId, category, stage;
