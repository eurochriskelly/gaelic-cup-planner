#!/bin/bash

FILE="src/shared/js/Provider.jsx"

if [[ "$1" == "--release" ]]; then
  perl -i -pe 's/%%(\d+)\.(\d+)\.(\d+)_RC%%/%%\1.\2.\3%%/g' "$FILE"
elif [[ "$1" == "--release-candidate" ]]; then
  perl -i -pe 's/%%(\d+)\.(\d+)\.(\d+)(_RC)?%%/"%%$1.$2." . ($3+1) . "_RC%%"/e' "$FILE"
else
  echo "Usage: $0 --release | --release-candidate"
  exit 1
fi