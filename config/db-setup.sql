-- SQL Script to create the EuroTourno database and its tables

-- Create the EuroTourno database
CREATE DATABASE IF NOT EXISTS EuroTourno;
USE EuroTourno;

-- Create the tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Date DATE,
    Title VARCHAR(255),
    Location VARCHAR(255),
    Lat FLOAT NULL,
    Lon FLOAT NULL
);

-- Create cards
CREATE TABLE IF NOT EXISTS cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tournament INT,
    fixture INT,
    playerNumber INT,
    playerName VARCHAR(255),
    cardColor ENUM('yellow', 'red', 'black'),
    FOREIGN KEY (tournamentId) REFERENCES tournaments(id)
);

-- Create the groupings table
CREATE TABLE IF NOT EXISTS groupings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tournamentId INT,
    category VARCHAR(255),
    sex ENUM('Mens', 'Ladies', 'Mixed'),
    groupNumber INT,
    FOREIGN KEY (tournamentId) REFERENCES tournaments(id)
);

-- Create the fixtures table
CREATE TABLE IF NOT EXISTS fixtures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tournamentId INT,
    category VARCHAR(255),
    groupNumber INT,
    stage ENUM('playoffs', 'group', 'finals', 'semis', 'runnerup', 'quarters', 'eights'),
    pitch VARCHAR(255),
    scheduled TIMESTAMP,
    started TIMESTAMP,
    ended TIMESTAMP,
    team1Id VARCHAR(255),
    goals1 INT DEFAULT NULL,
    points1 INT DEFAULT NULL,
    team2Id VARCHAR(255),
    goals2 INT DEFAULT NULL,
    points2 INT DEFAULT NULL,
    umpireTeamId VARCHAR(255),
    outcome ENUM('played', 'not played', 'conceded', 'forfeit') DEFAULT 'played',
    notes VARCHAR(255),
    FOREIGN KEY (tournamentId) REFERENCES tournaments(id)
    -- Additional foreign keys will be added when the teams table is created
);

-- Create the teams table
CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teamName VARCHAR(255),
    groupLetter VARCHAR(1),
    category VARCHAR(50),
    teamSheetSubmitted BOOLEAN,
    notes TEXT,
    FOREIGN KEY (groupId) REFERENCES groupings(id)
);

-- Create the pitches table
CREATE TABLE IF NOT EXISTS pitches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pitch VARCHAR(255),
    location VARCHAR(255),
    type ENUM('grass', 'astro')
    FOREIGN KEY (tournamentId) REFERENCES tournaments(id)
);

-- Create the cards table
CREATE TABLE IF NOT EXISTS cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teamId INT,
    stage ENUM('playoffs', 'group', 'finals', 'semis', 'runnerup', 'quarters', 'eights'),
    playerName VARCHAR(255),
    cardType ENUM('yellow', 'black', 'red'),
    FOREIGN KEY (teamId) REFERENCES teams(id)
);

-- Create the coordinators table
CREATE TABLE IF NOT EXISTS coordinators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    pitchId INT,
    FOREIGN KEY (pitchId) REFERENCES pitches(id)
);

-- Create the players table
CREATE TABLE IF NOT EXISTS players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255),
    secondName VARCHAR(255),
    dateOfBirth DATE,
    foirreannId VARCHAR(255),
    teamId INT,
    FOREIGN KEY (teamId) REFERENCES teams(id)
);

-- Create an audit log table to capture changes to the database
CREATE TABLE audit_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_name VARCHAR(255),
  record_id INT,
  column_name VARCHAR(255),
  old_value VARCHAR(255),
  new_value VARCHAR(255),
  user_id INT,
  change_date TIMESTAMP
);

