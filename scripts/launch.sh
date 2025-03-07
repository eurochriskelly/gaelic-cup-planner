#!/bin/bash

if [ -f './gg_env.sh' ];then
  source ./gg_env.sh
fi

cleanup() {
  echo "Cleaning up ..."
  pkill -P $$
}

trap cleanup EXIT TERM INT

runApp() {
  local run_number=0
  local pid=$2
  local CMD=node
  if [ "$DEV_MODE" = true ]; then
    CMD=nodemon
  fi

  if [ "$WATCH_MODE" = true ]; then
    CMD=nodemon
  fi

  local relaunch=true
  while "$relaunch"; do
    stopFile=/tmp/STOP_${pid}
    if [ -f "$stopFile" ]; then
      relaunch=false
    else
      echo "Run # ${run_number}"
      prog="src/backend/src/server.js"
      if [ ! -f "$prog" ];then
        echo "Missing program: $prog"
      fi
      $CMD "$prog" --port="$2" --app="$1" --use-mock=$DEV_MODE
      run_number=$((run_number + 1))
    fi
  done
  return
}

if [ ! -f gg_env.sh ]; then
  echo "Error: enviroment file not found [gg_env.sh]"
  exit 1
else
  source ./gg_env.sh
fi

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
  if [ "$arg" = "--watch" ]; then
    WATCH_MODE=true
  fi
done
runApp "$APP" "$PORT" &

wait
