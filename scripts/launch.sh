#!/bin/bash

runApp() {
    echo "Running app [$1] ..."
    nodemon src/backend/server.js \
        --port $2 \
        --app $1 &
}

runApp "groups" 4000
runApp "pitch" 4001