#!/bin/bash

set -e

for f in $(find src -name "*.scss");do
    echo "Watching scss files in directory [$f]"
    npx node-sass --watch $(dirname $f) --output $(dirname $f) &
done

wait
