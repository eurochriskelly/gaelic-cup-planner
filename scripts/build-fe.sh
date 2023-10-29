#!/bin/bash

set -e 

cleanup() {
    echo "Cleaning up ..."
    for pid in $(cat /tmp/build-fe.pids);do
        echo "Killing $pid"
        kill $pid
    done
    rm -f /tmp/build-fe.pids
    cd $TOP_DIR
}

trap cleanup SIGINT SIGTERM

## Main
echo "" > /tmp/build-fe.pids
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

watchParcel() {
    port=1234
    for ui in $(ls src/frontend/interfaces);do
        htm=src/frontend/interfaces/$ui/index.html
        if [ ! -f $htm ];then
            echo "ERROR: $htm not found"
            exit 1
        fi
        if "$build";then
            echo "Parcel buildign app [$ui] from dir [$(pwd) on port [$port]"
            parcel build $htm --port $port --dist-dir src/apps/$ui
            echo $! >> /tmp/build-fe.pids
        fi
        if "$watch";then
            echo $TOP_DIR
            echo "Parcel watch app [$ui] from dir [$(pwd)] on port [$port]"
            parcel $htm --port $port --dist-dir src/apps/$ui &
            echo $! >> /tmp/build-fe.pids
        fi
	port=$(($port + 1))
    done   
}

watchClasp() {
    for ui in $(ls src/frontend/interfaces);do
        cd src/apps/$ui
        echo "Listing ..."
        ls -alh
        echo "Pushing app [$ui]"
        clasp push --watch &
        echo $! >> /tmp/build-fe.pids
    done
}

echo "Bundling apps ..."
watchParcel
#echo "Pushing apps ..."
#watchClasp

wait

