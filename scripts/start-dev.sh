#!/bin/bash
#
#
npm install
npm install primeicons
nodemon src/backend/server.js --port="4000" --app="mobile" --use-mock=true &
vite --config vite.config-mobile.js --host &
nodemon src/backend/server.js --port="4001" --app="desktop" --use-mock=true &
vite --config vite.config-desktop.js --host &

wait
