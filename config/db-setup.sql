-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cards`
--

DROP TABLE IF EXISTS `cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tournamentId` int DEFAULT NULL,
  `fixtureId` int DEFAULT NULL,
  `playerId` int DEFAULT NULL,
  `playerNumber` int DEFAULT NULL,
  `playerName` varchar(255) DEFAULT NULL,
  `cardColor` enum('yellow','red','black') DEFAULT NULL,
  `team` text,
  `updateTimestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_cards_tournament` (`tournamentId`),
  KEY `fk_cards_fixture` (`fixtureId`),
  KEY `fk_cards_player` (`playerId`),
  CONSTRAINT `fk_cards_fixture` FOREIGN KEY (`fixtureId`) REFERENCES `fixtures` (`id`),
  CONSTRAINT `fk_cards_player` FOREIGN KEY (`playerId`) REFERENCES `players` (`id`),
  CONSTRAINT `fk_cards_tournament` FOREIGN KEY (`tournamentId`) REFERENCES `tournaments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clubTeams`
--

DROP TABLE IF EXISTS `clubTeams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clubTeams` (
  `teamId` int NOT NULL AUTO_INCREMENT,
  `clubId` int DEFAULT NULL,
  `teamName` varchar(255) DEFAULT NULL,
  `category` enum('gaa','lgfa','hurling','camogie','handball','rounders','youthfootball','youthhurling') DEFAULT NULL,
  `foundedYear` year DEFAULT NULL,
  `status` enum('active','inactive','unknown') DEFAULT NULL,
  `headCoach` varchar(255) DEFAULT NULL,
  `contactEmail` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`teamId`),
  KEY `clubId` (`clubId`),
  CONSTRAINT `clubTeams_ibfk_1` FOREIGN KEY (`clubId`) REFERENCES `clubs` (`clubId`)
) ENGINE=InnoDB AUTO_INCREMENT=832 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clubs`
--

DROP TABLE IF EXISTS `clubs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clubs` (
  `clubId` int NOT NULL AUTO_INCREMENT,
  `isStudent` varchar(3) DEFAULT NULL,
  `clubName` varchar(100) DEFAULT NULL,
  `clubLogo` blob,
  `founded` year DEFAULT NULL,
  `affiliated` year DEFAULT NULL,
  `deactivated` year DEFAULT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  `post_code` varchar(20) DEFAULT NULL,
  `country` char(2) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `region` varchar(50) DEFAULT NULL,
  `subregion` varchar(50) DEFAULT NULL,
  `status` char(1) DEFAULT NULL,
  `domain` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`clubId`)
) ENGINE=InnoDB AUTO_INCREMENT=2109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fixtures`
--

DROP TABLE IF EXISTS `fixtures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fixtures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tournamentId` int DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `groupNumber` int DEFAULT NULL,
  `stage` varchar(255) DEFAULT NULL,
  `pitch` varchar(255) DEFAULT NULL,
  `scheduled` timestamp NULL DEFAULT NULL,
  `started` timestamp NULL DEFAULT NULL,
  `ended` datetime DEFAULT NULL,
  `team1Planned` varchar(255) DEFAULT NULL,
  `team1Id` varchar(255) DEFAULT NULL,
  `goals1` int DEFAULT NULL,
  `points1` int DEFAULT NULL,
  `team2Planned` varchar(255) DEFAULT NULL,
  `team2Id` varchar(255) DEFAULT NULL,
  `goals2` int DEFAULT NULL,
  `points2` int DEFAULT NULL,
  `umpireTeamPlanned` varchar(255) DEFAULT NULL,
  `umpireTeamId` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `outcome` enum('played','conceded','not played','forfeit') DEFAULT 'played',
  PRIMARY KEY (`id`),
  KEY `tournamentId` (`tournamentId`),
  CONSTRAINT `fixtures_ibfk_1` FOREIGN KEY (`tournamentId`) REFERENCES `tournaments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=161013 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pitches`
--

DROP TABLE IF EXISTS `pitches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pitches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pitch` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `type` enum('grass','astro') DEFAULT NULL,
  `tournamentId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tournamentId` (`tournamentId`),
  CONSTRAINT `fk_tournamentId` FOREIGN KEY (`tournamentId`) REFERENCES `tournaments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=684 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `players`
--

DROP TABLE IF EXISTS `players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `players` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) DEFAULT NULL,
  `secondName` varchar(255) DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `foirreannId` varchar(255) DEFAULT NULL,
  `teamId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teamId` (`teamId`),
  CONSTRAINT `fk_players_squad` FOREIGN KEY (`teamId`) REFERENCES `squads` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sec_roles`
--

DROP TABLE IF EXISTS `sec_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sec_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `UserId` int DEFAULT NULL,
  `RoleName` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sec_users`
--

DROP TABLE IF EXISTS `sec_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sec_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `DateAdded` datetime DEFAULT CURRENT_TIMESTAMP,
  `Email` varchar(100) DEFAULT NULL,
  `Pass` varchar(100) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT NULL,
  `LastAuthenticated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `squads`
--

DROP TABLE IF EXISTS `squads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `squads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teamName` varchar(255) DEFAULT NULL,
  `teamSheetSubmitted` tinyint(1) DEFAULT NULL,
  `notes` text,
  `groupLetter` varchar(1) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `tournamentId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tournaments`
--

DROP TABLE IF EXISTS `tournaments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tournaments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Date` date DEFAULT NULL,
  `Title` varchar(255) DEFAULT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `Lat` float DEFAULT NULL,
  `Lon` float DEFAULT NULL,
  `code` varchar(4) DEFAULT '0000',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `v_categories`
--

DROP TABLE IF EXISTS `v_categories`;
/*!50001 DROP VIEW IF EXISTS `v_categories`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_categories` AS SELECT 
 1 AS `tournamentId`,
 1 AS `category`,
 1 AS `latestStage`,
 1 AS `totalGames`,
 1 AS `currentGame`,
 1 AS `brackets`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_club_matrix`
--

DROP TABLE IF EXISTS `v_club_matrix`;
/*!50001 DROP VIEW IF EXISTS `v_club_matrix`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_club_matrix` AS SELECT 
 1 AS `clubId`,
 1 AS `clubName`,
 1 AS `country`,
 1 AS `city`,
 1 AS `region`,
 1 AS `subregion`,
 1 AS `gaa`,
 1 AS `lgfa`,
 1 AS `hurling`,
 1 AS `camogie`,
 1 AS `handball`,
 1 AS `rounders`,
 1 AS `youthfootball`,
 1 AS `youthhurling`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_club_teams`
--

DROP TABLE IF EXISTS `v_club_teams`;
/*!50001 DROP VIEW IF EXISTS `v_club_teams`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_club_teams` AS SELECT 
 1 AS `clubId`,
 1 AS `clubName`,
 1 AS `post_code`,
 1 AS `country`,
 1 AS `city`,
 1 AS `region`,
 1 AS `subregion`,
 1 AS `clubStatus`,
 1 AS `domain`,
 1 AS `teamId`,
 1 AS `teamName`,
 1 AS `category`,
 1 AS `teamStatus`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_fixture_information`
--

DROP TABLE IF EXISTS `v_fixture_information`;
/*!50001 DROP VIEW IF EXISTS `v_fixture_information`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_fixture_information` AS SELECT 
 1 AS `id`,
 1 AS `tournamentId`,
 1 AS `category`,
 1 AS `groupNumber`,
 1 AS `pitch`,
 1 AS `stage`,
 1 AS `scheduled`,
 1 AS `scheduledTime`,
 1 AS `started`,
 1 AS `startedTime`,
 1 AS `team1`,
 1 AS `goals1`,
 1 AS `points1`,
 1 AS `team2`,
 1 AS `goals2`,
 1 AS `points2`,
 1 AS `umpireTeam`,
 1 AS `played`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_group_progress`
--

DROP TABLE IF EXISTS `v_group_progress`;
/*!50001 DROP VIEW IF EXISTS `v_group_progress`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_group_progress` AS SELECT 
 1 AS `category`,
 1 AS `groupNumber`,
 1 AS `remainingMatches`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_group_standings`
--

DROP TABLE IF EXISTS `v_group_standings`;
/*!50001 DROP VIEW IF EXISTS `v_group_standings`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_group_standings` AS SELECT 
 1 AS `category`,
 1 AS `grp`,
 1 AS `team`,
 1 AS `tournamentId`,
 1 AS `MatchesPlayed`,
 1 AS `Wins`,
 1 AS `Draws`,
 1 AS `Losses`,
 1 AS `PointsFrom`,
 1 AS `PointsDifference`,
 1 AS `TotalPoints`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_match_results`
--

DROP TABLE IF EXISTS `v_match_results`;
/*!50001 DROP VIEW IF EXISTS `v_match_results`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_match_results` AS SELECT 
 1 AS `tournamentId`,
 1 AS `category`,
 1 AS `id`,
 1 AS `w1`,
 1 AS `team1`,
 1 AS `score1`,
 1 AS `stage`,
 1 AS `score2`,
 1 AS `team2`,
 1 AS `w2`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_next_up`
--

DROP TABLE IF EXISTS `v_next_up`;
/*!50001 DROP VIEW IF EXISTS `v_next_up`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_next_up` AS SELECT 
 1 AS `tournamentId`,
 1 AS `category`,
 1 AS `pitch`,
 1 AS `scheduledTime`,
 1 AS `startedTime`,
 1 AS `grp`,
 1 AS `team1`,
 1 AS `team2`,
 1 AS `umpireTeam`,
 1 AS `goals1`,
 1 AS `points1`,
 1 AS `goals2`,
 1 AS `points2`,
 1 AS `matchId`,
 1 AS `isType`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_pitch_events`
--

DROP TABLE IF EXISTS `v_pitch_events`;
/*!50001 DROP VIEW IF EXISTS `v_pitch_events`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_pitch_events` AS SELECT 
 1 AS `pitch`,
 1 AS `location`,
 1 AS `type`,
 1 AS `tournamentId`,
 1 AS `category`,
 1 AS `team1`,
 1 AS `team2`,
 1 AS `startedTime`,
 1 AS `scheduledTime`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_tournaments`
--

DROP TABLE IF EXISTS `v_tournaments`;
/*!50001 DROP VIEW IF EXISTS `v_tournaments`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_tournaments` AS SELECT 
 1 AS `date`,
 1 AS `id`,
 1 AS `title`,
 1 AS `location`,
 1 AS `numFixtures`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_categories`
--

/*!50001 DROP VIEW IF EXISTS `v_categories`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`xxxx`@`thehost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_categories` AS select `detailed`.`tournamentId` AS `tournamentId`,`detailed`.`category` AS `category`,coalesce(max((case when (`detailed`.`currentGame` > 0) then `detailed`.`stage` end)),'group') AS `latestStage`,sum(`detailed`.`totalGames`) AS `totalGames`,sum(`detailed`.`currentGame`) AS `currentGame`,group_concat(distinct `detailed`.`brackets` order by `detailed`.`brackets` ASC separator ', ') AS `brackets` from (select `subquery`.`tournamentId` AS `tournamentId`,`subquery`.`category` AS `category`,`subquery`.`stage` AS `stage`,count(0) AS `totalGames`,sum((case when (`subquery`.`started` is not null) then 1 else 0 end)) AS `currentGame`,group_concat(distinct `subquery`.`bracket` order by `subquery`.`bracket` ASC separator ', ') AS `brackets` from (select `fixtures`.`tournamentId` AS `tournamentId`,`fixtures`.`category` AS `category`,`fixtures`.`stage` AS `stage`,`fixtures`.`started` AS `started`,(case when (`fixtures`.`stage` in ('playoffs','finals','semis','runnerup','quarters','eights')) then 'cup' when (`fixtures`.`stage` = 'group') then 'plate' else 'shield' end) AS `bracket` from `fixtures`) `subquery` group by `subquery`.`tournamentId`,`subquery`.`category`,`subquery`.`stage`) `detailed` group by `detailed`.`tournamentId`,`detailed`.`category` order by `detailed`.`tournamentId`,`detailed`.`category` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_club_matrix`
--

/*!50001 DROP VIEW IF EXISTS `v_club_matrix`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`xxxx`@`thehost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_club_matrix` AS select `c`.`clubId` AS `clubId`,`c`.`clubName` AS `clubName`,`c`.`country` AS `country`,`c`.`city` AS `city`,`c`.`region` AS `region`,`c`.`subregion` AS `subregion`,max((case when (`ct`.`category` = 'gaa') then 1 else 0 end)) AS `gaa`,max((case when (`ct`.`category` = 'lgfa') then 1 else 0 end)) AS `lgfa`,max((case when (`ct`.`category` = 'hurling') then 1 else 0 end)) AS `hurling`,max((case when (`ct`.`category` = 'camogie') then 1 else 0 end)) AS `camogie`,max((case when (`ct`.`category` = 'handball') then 1 else 0 end)) AS `handball`,max((case when (`ct`.`category` = 'rounders') then 1 else 0 end)) AS `rounders`,max((case when (`ct`.`category` = 'youthfootball') then 1 else 0 end)) AS `youthfootball`,max((case when (`ct`.`category` = 'youthhurling') then 1 else 0 end)) AS `youthhurling` from (`clubs` `c` left join `clubTeams` `ct` on((`c`.`clubId` = `ct`.`clubId`))) group by `c`.`clubId`,`c`.`clubName`,`c`.`post_code`,`c`.`country`,`c`.`city`,`c`.`region`,`c`.`subregion`,`c`.`status` having (`c`.`status` = 'A') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_club_teams`
--

/*!50001 DROP VIEW IF EXISTS `v_club_teams`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`xxxx`@`thehost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_club_teams` AS select `c`.`clubId` AS `clubId`,`c`.`clubName` AS `clubName`,`c`.`post_code` AS `post_code`,`c`.`country` AS `country`,`c`.`city` AS `city`,`c`.`region` AS `region`,`c`.`subregion` AS `subregion`,`c`.`status` AS `clubStatus`,`c`.`domain` AS `domain`,`ct`.`teamId` AS `teamId`,`ct`.`teamName` AS `teamName`,`ct`.`category` AS `category`,`ct`.`status` AS `teamStatus` from (`clubs` `c` join `clubTeams` `ct` on((`c`.`clubId` = `ct`.`clubId`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_fixture_information`
--

/*!50001 DROP VIEW IF EXISTS `v_fixture_information`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`xxxx`@`thehost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_fixture_information` AS select `fixtures`.`id` AS `id`,`fixtures`.`tournamentId` AS `tournamentId`,`fixtures`.`category` AS `category`,`fixtures`.`groupNumber` AS `groupNumber`,`fixtures`.`pitch` AS `pitch`,`fixtures`.`stage` AS `stage`,`fixtures`.`scheduled` AS `scheduled`,time_format(`fixtures`.`scheduled`,'%H:%i') AS `scheduledTime`,`fixtures`.`started` AS `started`,time_format(`fixtures`.`started`,'%H:%i') AS `startedTime`,`fixtures`.`team1Id` AS `team1`,`fixtures`.`goals1` AS `goals1`,`fixtures`.`points1` AS `points1`,`fixtures`.`team2Id` AS `team2`,`fixtures`.`goals2` AS `goals2`,`fixtures`.`points2` AS `points2`,`fixtures`.`umpireTeamId` AS `umpireTeam`,(case when ((`fixtures`.`goals1` is not null) and (`fixtures`.`points1` is not null) and (`fixtures`.`goals2` is not null) and (`fixtures`.`points2` is not null)) then true else false end) AS `played` from `fixtures` order by `fixtures`.`scheduled` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_group_progress`
--

/*!50001 DROP VIEW IF EXISTS `v_group_progress`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`xxxx`@`thehost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_group_progress` AS select `v_group_standings`.`category` AS `category`,`v_group_standings`.`grp` AS `groupNumber`,((count(`v_group_standings`.`grp`) * (count(`v_group_standings`.`grp`) - 1)) - sum(`v_group_standings`.`MatchesPlayed`)) AS `remainingMatches` from `v_group_standings` group by `v_group_standings`.`category`,`v_group_standings`.`grp` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_group_standings`
--

/*!50001 DROP VIEW IF EXISTS `v_group_standings`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`xxxx`@`thehost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_group_standings` AS select `combined`.`category` AS `category`,`combined`.`grp` AS `grp`,`combined`.`team` AS `team`,`combined`.`tournamentId` AS `tournamentId`,sum(`combined`.`MatchesPlayed`) AS `MatchesPlayed`,sum(`combined`.`Wins`) AS `Wins`,sum(`combined`.`Draws`) AS `Draws`,sum(`combined`.`Losses`) AS `Losses`,sum(`combined`.`PointsFrom`) AS `PointsFrom`,sum(`combined`.`PointsDifference`) AS `PointsDifference`,sum(`combined`.`TotalPoints`) AS `TotalPoints` from (select `fixtures`.`category` AS `category`,`fixtures`.`groupNumber` AS `grp`,`fixtures`.`team1Id` AS `team`,`fixtures`.`tournamentId` AS `tournamentId`,count(0) AS `MatchesPlayed`,sum((case when (((`fixtures`.`goals1` * 3) + `fixtures`.`points1`) > ((`fixtures`.`goals2` * 3) + `fixtures`.`points2`)) then 1 else 0 end)) AS `Wins`,sum((case when (((`fixtures`.`goals1` * 3) + `fixtures`.`points1`) = ((`fixtures`.`goals2` * 3) + `fixtures`.`points2`)) then 1 else 0 end)) AS `Draws`,sum((case when (((`fixtures`.`goals1` * 3) + `fixtures`.`points1`) < ((`fixtures`.`goals2` * 3) + `fixtures`.`points2`)) then 1 else 0 end)) AS `Losses`,sum(((`fixtures`.`goals1` * 3) + `fixtures`.`points1`)) AS `PointsFrom`,sum((((`fixtures`.`goals1` * 3) + `fixtures`.`points1`) - ((`fixtures`.`goals2` * 3) + `fixtures`.`points2`))) AS `PointsDifference`,sum((case when (((`fixtures`.`goals1` * 3) + `fixtures`.`points1`) > ((`fixtures`.`goals2` * 3) + `fixtures`.`points2`)) then 2 when (((`fixtures`.`goals1` * 3) + `fixtures`.`points1`) = ((`fixtures`.`goals2` * 3) + `fixtures`.`points2`)) then 1 else 0 end)) AS `TotalPoints` from `fixtures` where (`fixtures`.`stage` = 'group') group by `fixtures`.`category`,`fixtures`.`groupNumber`,`fixtures`.`team1Id`,`fixtures`.`tournamentId` union all select `fixtures`.`category` AS `category`,`fixtures`.`groupNumber` AS `grp`,`fixtures`.`team2Id` AS `team`,`fixtures`.`tournamentId` AS `tournamentId`,count(0) AS `MatchesPlayed`,sum((case when (((`fixtures`.`goals2` * 3) + `fixtures`.`points2`) > ((`fixtures`.`goals1` * 3) + `fixtures`.`points1`)) then 1 else 0 end)) AS `Wins`,sum((case when (((`fixtures`.`goals2` * 3) + `fixtures`.`points2`) = ((`fixtures`.`goals1` * 3) + `fixtures`.`points1`)) then 1 else 0 end)) AS `Draws`,sum((case when (((`fixtures`.`goals2` * 3) + `fixtures`.`points2`) < ((`fixtures`.`goals1` * 3) + `fixtures`.`points1`)) then 1 else 0 end)) AS `Losses`,sum(((`fixtures`.`goals2` * 3) + `fixtures`.`points2`)) AS `PointsFrom`,sum((((`fixtures`.`goals2` * 3) + `fixtures`.`points2`) - ((`fixtures`.`goals1` * 3) + `fixtures`.`points1`))) AS `PointsDifference`,sum((case when (((`fixtures`.`goals2` * 3) + `fixtures`.`points2`) > ((`fixtures`.`goals1` * 3) + `fixtures`.`points1`)) then 2 when (((`fixtures`.`goals2` * 3) + `fixtures`.`points2`) = ((`fixtures`.`goals1` * 3) + `fixtures`.`points1`)) then 1 else 0 end)) AS `TotalPoints` from `fixtures` where (`fixtures`.`stage` = 'group') group by `fixtures`.`category`,`fixtures`.`groupNumber`,`fixtures`.`team2Id`,`fixtures`.`tournamentId`) `combined` group by `combined`.`category`,`combined`.`grp`,`combined`.`team`,`combined`.`tournamentId` order by `combined`.`category` desc,`combined`.`grp`,`TotalPoints` desc,`PointsDifference` desc,`PointsFrom` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_match_results`
--

/*!50001 DROP VIEW IF EXISTS `v_match_results`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`xxxx`@`thehost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_match_results` AS select `fixtures`.`tournamentId` AS `tournamentId`,`fixtures`.`category` AS `category`,substr(cast(`fixtures`.`id` as char charset utf8mb4),-(2)) AS `id`,(case when (((`fixtures`.`goals1` * 3) + `fixtures`.`points1`) > ((`fixtures`.`goals2` * 3) + `fixtures`.`points2`)) then 'won' else '' end) AS `w1`,`fixtures`.`team1Id` AS `team1`,concat(`fixtures`.`goals1`,'-',lpad(`fixtures`.`points1`,2,'0'),' (',((`fixtures`.`goals1` * 3) + `fixtures`.`points1`),')') AS `score1`,`fixtures`.`stage` AS `stage`,concat(`fixtures`.`goals2`,'-',lpad(`fixtures`.`points2`,2,'0'),' (',((`fixtures`.`goals2` * 3) + `fixtures`.`points2`),')') AS `score2`,`fixtures`.`team2Id` AS `team2`,(case when (((`fixtures`.`goals2` * 3) + `fixtures`.`points2`) > ((`fixtures`.`goals1` * 3) + `fixtures`.`points1`)) then 'won' else '' end) AS `w2` from `fixtures` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_next_up`
--

/*!50001 DROP VIEW IF EXISTS `v_next_up`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`xxxx`@`thehost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_next_up` AS with `RankedFixtures` as (select `v_fixture_information`.`tournamentId` AS `tournamentId`,`v_fixture_information`.`category` AS `category`,`v_fixture_information`.`pitch` AS `pitch`,`v_fixture_information`.`scheduledTime` AS `scheduledTime`,`v_fixture_information`.`startedTime` AS `startedTime`,`v_fixture_information`.`groupNumber` AS `grp`,`v_fixture_information`.`team1` AS `team1`,`v_fixture_information`.`team2` AS `team2`,`v_fixture_information`.`umpireTeam` AS `umpireTeam`,`v_fixture_information`.`goals1` AS `goals1`,`v_fixture_information`.`points1` AS `points1`,`v_fixture_information`.`goals2` AS `goals2`,`v_fixture_information`.`points2` AS `points2`,`v_fixture_information`.`id` AS `matchId`,'ranked' AS `isType`,row_number() OVER (PARTITION BY `v_fixture_information`.`category` ORDER BY `v_fixture_information`.`scheduledTime` )  AS `rn` from `v_fixture_information` where (`v_fixture_information`.`played` = 0)), `RecentPlayedFixtures` as (select `v_fixture_information`.`tournamentId` AS `tournamentId`,`v_fixture_information`.`category` AS `category`,`v_fixture_information`.`pitch` AS `pitch`,`v_fixture_information`.`scheduledTime` AS `scheduledTime`,`v_fixture_information`.`startedTime` AS `startedTime`,`v_fixture_information`.`groupNumber` AS `grp`,`v_fixture_information`.`team1` AS `team1`,`v_fixture_information`.`team2` AS `team2`,`v_fixture_information`.`umpireTeam` AS `umpireTeam`,`v_fixture_information`.`goals1` AS `goals1`,`v_fixture_information`.`points1` AS `points1`,`v_fixture_information`.`goals2` AS `goals2`,`v_fixture_information`.`points2` AS `points2`,`v_fixture_information`.`id` AS `matchId`,'recent' AS `isType`,row_number() OVER (PARTITION BY `v_fixture_information`.`category` ORDER BY `v_fixture_information`.`startedTime` desc )  AS `rn` from `v_fixture_information` where (`v_fixture_information`.`played` = 1)) select `RankedFixtures`.`tournamentId` AS `tournamentId`,`RankedFixtures`.`category` AS `category`,`RankedFixtures`.`pitch` AS `pitch`,`RankedFixtures`.`scheduledTime` AS `scheduledTime`,`RankedFixtures`.`startedTime` AS `startedTime`,`RankedFixtures`.`grp` AS `grp`,`RankedFixtures`.`team1` AS `team1`,`RankedFixtures`.`team2` AS `team2`,`RankedFixtures`.`umpireTeam` AS `umpireTeam`,`RankedFixtures`.`goals1` AS `goals1`,`RankedFixtures`.`points1` AS `points1`,`RankedFixtures`.`goals2` AS `goals2`,`RankedFixtures`.`points2` AS `points2`,`RankedFixtures`.`matchId` AS `matchId`,`RankedFixtures`.`isType` AS `isType` from `RankedFixtures` where (`RankedFixtures`.`rn` <= 3) union all select `RecentPlayedFixtures`.`tournamentId` AS `tournamentId`,`RecentPlayedFixtures`.`category` AS `category`,`RecentPlayedFixtures`.`pitch` AS `pitch`,`RecentPlayedFixtures`.`scheduledTime` AS `scheduledTime`,`RecentPlayedFixtures`.`startedTime` AS `startedTime`,`RecentPlayedFixtures`.`grp` AS `grp`,`RecentPlayedFixtures`.`team1` AS `team1`,`RecentPlayedFixtures`.`team2` AS `team2`,`RecentPlayedFixtures`.`umpireTeam` AS `umpireTeam`,`RecentPlayedFixtures`.`goals1` AS `goals1`,`RecentPlayedFixtures`.`points1` AS `points1`,`RecentPlayedFixtures`.`goals2` AS `goals2`,`RecentPlayedFixtures`.`points2` AS `points2`,`RecentPlayedFixtures`.`matchId` AS `matchId`,`RecentPlayedFixtures`.`isType` AS `isType` from `RecentPlayedFixtures` where (`RecentPlayedFixtures`.`rn` = 1) order by `category`,`scheduledTime` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_pitch_events`
--

/*!50001 DROP VIEW IF EXISTS `v_pitch_events`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`xxxx`@`thehost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_pitch_events` AS select `pi`.`pitch` AS `pitch`,`pi`.`location` AS `location`,`pi`.`type` AS `type`,coalesce(`vfi`.`tournamentId`,'default_tournament_id') AS `tournamentId`,`vfi`.`category` AS `category`,`vfi`.`team1` AS `team1`,`vfi`.`team2` AS `team2`,`vfi`.`startedTime` AS `startedTime`,`vfi`.`scheduledTime` AS `scheduledTime` from (`pitches` `pi` left join (select `v_fixture_information`.`tournamentId` AS `tournamentId`,`v_fixture_information`.`pitch` AS `pitch`,`v_fixture_information`.`category` AS `category`,`v_fixture_information`.`team1` AS `team1`,`v_fixture_information`.`team2` AS `team2`,`v_fixture_information`.`startedTime` AS `startedTime`,`v_fixture_information`.`scheduledTime` AS `scheduledTime` from `v_fixture_information` where ((`v_fixture_information`.`played` = 0) and (`v_fixture_information`.`scheduledTime` = (select min(`vfi2`.`scheduledTime`) from `v_fixture_information` `vfi2` where ((`vfi2`.`pitch` = `v_fixture_information`.`pitch`) and (`vfi2`.`played` = 0) and (`vfi2`.`tournamentId` = `v_fixture_information`.`tournamentId`)))))) `vfi` on(((`pi`.`pitch` = `vfi`.`pitch`) and (`pi`.`tournamentId` = `vfi`.`tournamentId`)))) order by (`vfi`.`scheduledTime` is null),`vfi`.`scheduledTime`,`pi`.`pitch` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_tournaments`
--

/*!50001 DROP VIEW IF EXISTS `v_tournaments`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`xxxx`@`thehost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_tournaments` AS select `t`.`Date` AS `date`,`t`.`id` AS `id`,`t`.`Title` AS `title`,`t`.`Location` AS `location`,count(`f`.`stage`) AS `numFixtures` from (`tournaments` `t` left join `fixtures` `f` on((`t`.`id` = `f`.`tournamentId`))) group by `t`.`id`,`t`.`Title`,`t`.`Location` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-25 11:54:58
