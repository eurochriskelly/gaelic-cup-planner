CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `v_pitch_events` AS
    SELECT 
        `pi`.`pitch` AS `pitch`,
        `pi`.`location` AS `location`,
        `pi`.`type` AS `type`,
        COALESCE(`vfi`.`tournamentId`, 'default_tournament_id') AS `tournamentId`,
        `vfi`.`category` AS `category`,
        `vfi`.`team1` AS `team1`,
        `vfi`.`team2` AS `team2`,
        `vfi`.`startedTime` AS `startedTime`,
        `vfi`.`scheduledTime` AS `scheduledTime`
    FROM
        `pitches` `pi`
        LEFT JOIN (SELECT 
            `v_fixture_information`.`tournamentId` AS `tournamentId`,
            `v_fixture_information`.`pitch` AS `pitch`,
            `v_fixture_information`.`category` AS `category`,
            `v_fixture_information`.`team1` AS `team1`,
            `v_fixture_information`.`team2` AS `team2`,
            `v_fixture_information`.`startedTime` AS `startedTime`,
            `v_fixture_information`.`scheduledTime` AS `scheduledTime`
        FROM
            `v_fixture_information`
        WHERE
            `v_fixture_information`.`played` = 0
            AND `v_fixture_information`.`scheduledTime` = (
                SELECT MIN(`vfi2`.`scheduledTime`)
                FROM `v_fixture_information` `vfi2`
                WHERE `vfi2`.`pitch` = `v_fixture_information`.`pitch`
                  AND `vfi2`.`played` = 0
                  AND `vfi2`.`tournamentId` = `v_fixture_information`.`tournamentId`
            )
        ) `vfi` 
        ON `pi`.`pitch` = `vfi`.`pitch` AND `pi`.`tournamentId` = `vfi`.`tournamentId`
    ORDER BY 
        (`vfi`.`scheduledTime` IS NULL),
        `vfi`.`scheduledTime`,
        `pi`.`pitch`;


