CREATE VIEW v_club_matrix AS
SELECT
    c.clubId,
    c.clubName,
    c.country,
    c.city,
    c.region,
    c.subregion,
    MAX(CASE WHEN ct.category = 'gaa' THEN 1 ELSE 0 END) AS gaa,
    MAX(CASE WHEN ct.category = 'lgfa' THEN 1 ELSE 0 END) AS lgfa,
    MAX(CASE WHEN ct.category = 'hurling' THEN 1 ELSE 0 END) AS hurling,
    MAX(CASE WHEN ct.category = 'camogie' THEN 1 ELSE 0 END) AS camogie,
    MAX(CASE WHEN ct.category = 'handball' THEN 1 ELSE 0 END) AS handball,
    MAX(CASE WHEN ct.category = 'rounders' THEN 1 ELSE 0 END) AS rounders,
    MAX(CASE WHEN ct.category = 'youthfootball' THEN 1 ELSE 0 END) AS youthfootball,
    MAX(CASE WHEN ct.category = 'youthhurling' THEN 1 ELSE 0 END) AS youthhurling
FROM
    clubs c
LEFT JOIN
    clubTeams ct ON c.clubId = ct.clubId
GROUP BY
    c.clubId,
    c.clubName,
    c.post_code,
    c.country,
    c.city,
    c.region,
    c.subregion,
    c.status

HAVING c.status = 'A'
