#!/bin/bash

set -e 

TOP_DIR=$(pwd)
echo "TOP_DIR: $TOP_DIR"
# kill -9 $(lsof -t -i:5555)
cd src/frontend/mock
echo "Starting httpster on port 5555"
httpster -p 5555 &
watch -d cat huddle.html
