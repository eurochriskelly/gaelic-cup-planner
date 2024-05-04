#!/bin/bash

set -e

interfaces=src/frontend/interfaces

PARCEL=$(pwd)/node_modules/.bin/parcel

cleanup() {
	echo "Cleaning up ..."
	for pid in $(cat /tmp/build-fe.pids); do
		echo "Killing $pid"
		kill $pid
	done
	rm -f /tmp/build-fe.pids
	cd $TOP_DIR
}

trap cleanup SIGINT SIGTERM

## Main
echo "" >/tmp/build-fe.pids
watch=false
if [ "$1" == "--watch" ]; then
	echo "Watching ..."
	watch=true
fi

build=false
if [ "$1" == "--build" ]; then
	echo "Building ..."
	build=true
fi

echo "Building frontend interfaces ..."
TOP_DIR=$(pwd)

runParcel() {
	echo "Bundling apps ..."
	port=1234
	for ui in $(ls $interfaces); do
		thisui=$interfaces/$ui
		htm=$thisui/index.html
		if [ ! -f $htm ]; then
			echo "WARNING: $htm not found."
			break
		fi

		# Build the app cleanly
		if "$build"; then
			mkdir -p src/apps/$ui/dist
			$PARCEL build $htm --dist-dir src/apps/$ui/dist
			echo "Showing dist contents ..."
			mkdir -p src/apps/$ui/dist
			ls -alh src/apps/$ui/dist
		fi

		# Watch for changes
		if "$watch"; then
			echo "Parcel watch app [$ui] from dir [$(pwd)] on port [$port]"
			mkdir -p $thisui/watch
			# set -o xtrace
			$PARCEL $htm --port $port --dist-dir $thisui/watch --no-cache &
			# set +o xtrace
			echo $! >>/tmp/build-fe.pids
		fi
		port=$(($port + 1))
	done
}

runParcel
echo "Waiting ..."
wait
