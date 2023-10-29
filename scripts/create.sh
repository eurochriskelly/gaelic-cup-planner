#!/bin/bash

rootDir=./src/apps2
test -d $rootDir || mkdir -p $rootDir
echo "Enter the name of the tournament"
read title
clasp create --title "$title" --type standalone --rootDir $rootDir