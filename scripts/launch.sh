#!/bin/bash
#
if [ -z "$GCP_TOURN_NUM" ];then
  echo "Tournament num is not set. Source env.sh!"
  exit 1
fi

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

	local relaunch=true

	while "$relaunch"; do
		stopFile=/tmp/STOP_${pid}
		if [ -f "$stopFile" ]; then
			relaunch=false
		else
      echo "Run # ${run_number}"
			node src/backend/server.js --port="$2" --app="$1" --tournamentId="$3"
			run_number=$((run_number + 1))
		fi
	done
  return
	while [[ $run_number -lt 5 ]]; do
		if [[ $run_number -gt 0 ]]; then
			echo "Retrying in 5 seconds ..."
			sleep 5
		fi
		if node src/backend/server.js --port="$2" --app="$1" --tournamentId="$3" &>/dev/null; then
			break
		fi
		run_number=$((run_number + 1))
	done
}

PORT1=4000
PORT2=4001
for arg in "$@"; do
    if [ "$arg" = "--dev" ]; then
        PORT1=$(($PORT1 + 1000))
        PORT2=$(($PORT2 + 1000))
    fi
done
runApp "groups" $PORT1 $GCP_TOURN_NUM &
runApp "pitch" $PORT2 $GCP_TOURN_NUM &

wait
