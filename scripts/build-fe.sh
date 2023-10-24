#!/bin/bash

set -e 

TOP_DIR=$(pwd)
echo "TOP_DIR: $TOP_DIR"
cd src/frontend/interfaces/huddle
ls
test -d dist && rm -rf dist
mkdir dist
echo "Building front end"
node build.config.js
ls -alh $TOP_DIR/src/frontend/mock
head -n 10 $TOP_DIR/src/frontend/mock/teams.html