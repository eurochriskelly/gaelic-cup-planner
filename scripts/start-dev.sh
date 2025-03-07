#!/bin/bash
#
#
npm install
if [ ! -f gg_env.sh ]; then
  echo "gg_env.sh missing!"
  exit 1
fi
source gg_env.sh
PORT=5000
prog="src/backend/src/server.js"
if [ ! -f "$prog" ];then
  echo "Missing program: $prog"
  exit 1
fi
nodemon "$prog" --port="$PORT" --app="mobile" &
GG_PORT_OVERRIDE=$PORT vite --config vite.config-mobile.js --host &

# nodemon src/backend/src/server.js --port="4001" --app="desktop" --use-mock=true &
# vite --config vite.config-desktop.js --host &

wait
