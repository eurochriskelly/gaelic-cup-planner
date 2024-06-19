#!/bin/bash
#
npm run launch:dev &
vite --config vite.config-mobile.js --host &
vite --config vite.config-desktop.js --host &

wait
