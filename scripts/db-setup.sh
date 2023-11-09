#!/bin/bash

# The path to the MySQL binary
MYSQL="/usr/bin/mysql"

# User credentials for the MySQL database

DB_USER=root
read -s -p "Enter your password: " DB_PASS

# The SQL script that will be executed
SQL_SCRIPT="config/db-setup.sql"

# Execute the SQL script using the MySQL binary
$MYSQL -u $DB_USER -p$DB_PASS < $SQL_SCRIPT
