#!/bin/bash

# Function to clean up background processes on exit
cleanup() {
    echo "Stopping development servers..."
    # Use pkill to find and kill the specific processes started by this script
    # Use the -f flag to match the full command line
    pkill -f "vite --config vite.config-desktop.js"
    pkill -f "vite --config vite.config-mobile.js"
    pkill -f "storybook dev"
    echo "Cleanup complete."
    exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM to run the cleanup function
trap cleanup SIGINT SIGTERM

# Kill existing servers first
echo "Killing existing servers..."
pkill -f "vite --config vite.config-desktop.js" || true
pkill -f "vite --config vite.config-mobile.js" || true
pkill -f "storybook dev" || true
echo "Existing servers stopped."

# Start development servers in the background
echo "Starting development servers..."
echo "Desktop server on port 5174"
npm run dev:desktop &
DESKTOP_PID=$!

echo "Mobile server on port 5173"
npm run dev:mobile &
MOBILE_PID=$!

echo "Storybook on port 6006"
npm run storybook &
STORYBOOK_PID=$!

# Wait for any of the background jobs to exit.
# If one exits (e.g., user stops one manually or it crashes),
# the script will proceed to the cleanup function.
# The 'wait -n' command waits for the next job to terminate.
echo "All servers started. Waiting for processes to finish or Ctrl+C..."
wait -n

# Call cleanup if any process finishes or if script receives a signal
cleanup
