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

runParcel() {
    echo "Bundling apps ..."
    port=1234
    for ui in $(ls src/frontend/interfaces);do
        htm=src/frontend/interfaces/$ui/index.html
        if [ ! -f $htm ];then
            echo "ERROR: $htm not found"
            exit 1
        fi
        if "$build";then
            echo "Parcel building app [$ui] from dir [$(pwd) on port [$port]"
            mkdir -p src/apps/$ui/dist
            parcel build $htm --dist-dir src/apps/$ui/dist
            echo "Showing dist contents ..."
            ls -alh src/apps/$ui/dist
            if [ -f src/apps/$ui/dist/index.html ];then
                cp src/apps/$ui/dist/index.html src/apps/$ui/index.html
            else
                echo "ERROR: dist html not found!"
            fi
        fi
        if "$watch";then
            echo "Watching app [$ui] from dir [$(pwd)] on port [$port]"
            echo $TOP_DIR
            echo "Parcel watch app [$ui] from dir [$(pwd)] on port [$port]"
            mkdir -p src/apps/$ui/dist/watch
            parcel $htm --port $port --dist-dir src/apps/$ui/watch &
            echo $! >> /tmp/build-fe.pids
        fi
	port=$(($port + 1))
    done   
}

watchClasp() {
    echo "Deploying google app script... "
    for ui in $(ls src/frontend/interfaces);do
        cd src/apps/$ui
        echo "Pushing app [$ui]"
        clasp push --watch &
        echo $! >> /tmp/build-fe.pids
    done
}

runParcel

if "$build";then
    echo "Done"
else 
    echo "Pushing apps ..."
    watchClasp
    wait
    echo "Done"
fi

