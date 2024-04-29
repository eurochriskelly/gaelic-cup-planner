# Gaelic Cup Planner

## Overview
The Gaelic Cup Planner is a comprehensive tool designed to assist in
the planning and execution of Gaelic cup tournaments. From preliminary
rounds to elimination stages, this software facilitates the scheduling
of the entire tournament. It integrates with a mobile application used
by field coordinators on-site to report live updates on fixtures,
ensuring real-time tracking and management of the tournament progress.

## Features

- **Tournament Scheduling**: Automate the creation of tournament schedules, from the initial rounds to the finals.
- **Real-Time Updates**: Field coordinators can update match statuses directly through a mobile app, ensuring that all stakeholders have the latest information.
- **Central Database**: All data is centrally stored and managed, allowing for efficient tracking and historical data analysis.
- **Stakeholder Access**: Real-time results and schedules are accessible to all stakeholders, keeping everyone informed.

## Components

The software is split into separate front-end components and shared
components which are npm installed currently including:

- gcp-core: Core business logic shared by multiple front-end and back-end apps.
- gcp-core-fe: Shared front-end code such as styles and shared components.
- gcp-tournmgr-fe: Front-end for organizing tournaments.

