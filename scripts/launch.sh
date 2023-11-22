#!/bin/bash

trap cleanup SIGINT SIGTERM EXIT

cleanup() {
    echo "Cleaning up ..."
    if [[ -f /tmp/run-app.pids ]]; then
        while read -r pid; do
            if ps -p $pid > /dev/null; then
                echo "Killing $pid"
                kill $pid
            fi
        done < /tmp/run-app.pids
        rm -f /tmp/run-app.pids
    fi
    cd "$TOP_DIR" || exit
}

# Ensure the PID file exists and is empty
: > /tmp/run-app.pids

runApp() {
    echo "Running app [$1] ..."
    nodemon src/backend/server.js \
        --port="$2" \
        --app="$1" &
    echo $! >> /tmp/run-app.pids
}

runApp "groups" 4000
runApp "pitch" 4001
