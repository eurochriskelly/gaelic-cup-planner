CREATE VIEW v_club_teams AS
SELECT
    c.clubId,
    c.clubName,
    c.post_code,
    c.country,
    c.city,
    c.region,
    c.subregion,
    c.status AS clubStatus,
    c.domain,
    ct.teamId,
    ct.teamName,
    ct.category,
    ct.status AS teamStatus
FROM
    clubs c
JOIN
    clubTeams ct ON c.clubId = ct.clubId;
