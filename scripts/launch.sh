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
    local run_number=0
    while [[ $run_number -lt 5 ]]; do
        if [[ $run_number -gt 0 ]]; then
            echo "Retrying in 5 seconds ..."
            sleep 5
        fi
        if node src/backend/server.js --port="$2" --app="$1" &> /dev/null; then
            break
        fi
        run_number=$((run_number + 1))
    done
}

runApp "groups" 4000 &
runApp "pitch" 4001 &

wait
