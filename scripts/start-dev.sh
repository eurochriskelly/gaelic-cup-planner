#!/bin/bash
#
npm run launch:dev &
bash scripts/launch.sh --port 4000 --app mobile --dev &
vite --config vite.config-mobile.js --host &
vite --config vite.config-desktop.js --host &

wait
