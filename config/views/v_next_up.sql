CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_next_up` AS with `RankedFixtures` as (
    
    
select 
    `v_fixture_information`.`tournamentId` AS `tournamentId`,
    `v_fixture_information`.`category` AS `category`,
    `v_fixture_information`.`pitch` AS `pitch`,
    `v_fixture_information`.`scheduledTime` AS `scheduledTime`,
    `v_fixture_information`.`startedTime` AS `startedTime`,
    `v_fixture_information`.`team1` AS `team1`,
    `v_fixture_information`.`team2` AS `team2`,
    `v_fixture_information`.`umpireTeam` AS `umpireTeam`,
    `v_fixture_information`.`goals1` AS `goals1`,
    `v_fixture_information`.`points1` AS `points1`,
    `v_fixture_information`.`goals2` AS `goals2`,
    `v_fixture_information`.`points2` AS `points2`,
    row_number() OVER (PARTITION BY `v_fixture_information`.`category` ORDER BY `v_fixture_information`.`scheduledTime` )  AS `rn` from `v_fixture_information` where (`v_fixture_information`.`played` = 0)), `RecentPlayedFixtures` as (select `v_fixture_information`.`tournamentId` AS `tournamentId`,`v_fixture_information`.`category` AS `category`,`v_fixture_information`.`pitch` AS `pitch`,`v_fixture_information`.`scheduledTime` AS `scheduledTime`,`v_fixture_information`.`startedTime` AS `startedTime`,`v_fixture_information`.`team1` AS `team1`,`v_fixture_information`.`team2` AS `team2`,`v_fixture_information`.`umpireTeam` AS `umpireTeam`,`v_fixture_information`.`goals1` AS `goals1`,`v_fixture_information`.`points1` AS `points1`,`v_fixture_information`.`goals2` AS `goals2`,`v_fixture_information`.`points2` AS `points2`,row_number() OVER (PARTITION BY `v_fixture_information`.`category` ORDER BY `v_fixture_information`.`startedTime` desc )  AS `rn` from `v_fixture_information` where (`v_fixture_information`.`played` = 1)) select `RankedFixtures`.`tournamentId` AS `tournamentId`,`RankedFixtures`.`category` AS `category`,`RankedFixtures`.`pitch` AS `pitch`,`RankedFixtures`.`scheduledTime` AS `scheduledTime`,`RankedFixtures`.`startedTime` AS `startedTime`,`RankedFixtures`.`team1` AS `team1`,`RankedFixtures`.`team2` AS `team2`,`RankedFixtures`.`umpireTeam` AS `umpireTeam`,`RankedFixtures`.`goals1` AS `goals1`,`RankedFixtures`.`points1` AS `points1`,`RankedFixtures`.`goals2` AS `goals2`,`RankedFixtures`.`points2` AS `points2` from `RankedFixtures` where (`RankedFixtures`.`rn` <= 3) union all select `RecentPlayedFixtures`.`tournamentId` AS `tournamentId`,`RecentPlayedFixtures`.`category` AS `category`,`RecentPlayedFixtures`.`pitch` AS `pitch`,`RecentPlayedFixtures`.`scheduledTime` AS `scheduledTime`,`RecentPlayedFixtures`.`startedTime` AS `startedTime`,`RecentPlayedFixtures`.`team1` AS `team1`,`RecentPlayedFixtures`.`team2` AS `team2`,`RecentPlayedFixtures`.`umpireTeam` AS `umpireTeam`,`RecentPlayedFixtures`.`goals1` AS `goals1`,`RecentPlayedFixtures`.`points1` AS `points1`,`RecentPlayedFixtures`.`goals2` AS `goals2`,`RecentPlayedFixtures`.`points2` AS `points2` from `RecentPlayedFixtures` where (`RecentPlayedFixtures`.`rn` = 1) order by `category`,`scheduledTime`;
