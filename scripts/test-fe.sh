#!/bin/bash

set -e 

TOP_DIR=$(pwd)
echo "TOP_DIR: $TOP_DIR"
cd src/frontend/mock
echo "Starting httpster on port 5555"
httpster -p 5555