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

startup() {
    # kill all instances of server.js before starting
    # - do not kill all node processes, as this may kill required processes
    for pid in $(pgrep -f "node src/backend/server.js"); do
        echo "Killing $pid"
        kill $pid
    done

    # also look in /tmp/run-app.pids for any running processes
    if [[ -f /tmp/run-app.pids ]]; then
        while read -r pid; do
            if ps -p $pid > /dev/null; then
                echo "Killing $pid"
                kill $pid
            fi
        done < /tmp/run-app.pids
        rm -f /tmp/run-app.pids
    fi
    
    
    echo "Starting $1 on port $2 ..."
    if node src/backend/server.js --port="$2" --app="$1" &> /dev/null; then
        echo "Started $1 on port $2"
        echo $! >> /tmp/run-app.pids
    else
        echo "Failed to start $1 on port $2"
        exit 1
    fi
}

# Ensure the PID file exists and is empty
: > /tmp/run-app.pids

runApp() {
    local run_number=0
    while true; do
        node src/backend/server.js --port="$2" --app="$1"
        run_number=$((run_number + 1))
    done


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
