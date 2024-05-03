#!/bin/bash

set -e

echo "Converting all scss files in directory [$f]"
for f in $(find src -name "*.scss");do
  echo "Converting $f"
  npx node-sass $f --output $(dirname $f) 
done

for f in $(find src -name "*.scss");do
  echo "Watching scss files in directory [$f]"
  npx node-sass --watch $(dirname $f) --output $(dirname $f) &
done

wait
