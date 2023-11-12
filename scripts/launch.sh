#!/bin/bash

trap cleanup SIGINT SIGTERM
cleanup() {
    echo "Cleaning up ..."
    for pid in $(cat /tmp/run-app.pids);do
        echo "Killing $pid"
        kill $pid
    done
    rm -f /tmp/run-app.pids
    cd $TOP_DIR
}

touch /tmp/run-app.pids
echo "" > /tmp/run-app.pids
runApp() {
    echo "Running app [$1] ..."
    nodemon src/backend/server.js \
        --port="$2" \
        --app="$1" &
    echo $! >> /tmp/run-app.pids
}

runApp "groups" 4000
runApp "pitch" 4001