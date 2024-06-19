#!/bin/bash
#

trap cleanup SIGINT SIGTERM EXIT

cleanup() {
	echo "Cleaning up ..."
	if [[ -f /tmp/run-app.pids ]]; then
		while read -r pid; do
			if ps -p $pid >/dev/null; then
				echo "Killing $pid"
				kill $pid
			fi
		done </tmp/run-app.pids
		rm -f /tmp/run-app.pids
	fi
	cd "$TOP_DIR" || exit
}

runApp() {
	local run_number=0
	local pid=$2
  local CMD=node
  if [ "$DEV_MODE" = true ]; then
    CMD=nodemon
  fi

	local relaunch=true
	while "$relaunch"; do
		stopFile=/tmp/STOP_${pid}
		if [ -f "$stopFile" ]; then
			relaunch=false
		else
      echo "Run # ${run_number}"
			$CMD src/backend/server.js --port="$2" --app="$1" --use-mock=$DEV_MODE
			run_number=$((run_number + 1))
		fi
	done
  return
}

DEV_MODE=false
for arg in "$@"; do
    if [ "$arg" = "--port" ]; then
        shift
        PORT=$1
        shift
    fi
    if [ "$arg" = "--app" ]; then
        shift
        APP=$1 
        shift
    fi
    if [ "$arg" = "--dev" ]; then
        DEV_MODE=true
    fi
done
runApp "$APP" "$PORT" &

wait
