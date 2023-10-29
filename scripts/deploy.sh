#/bin/bash

TOP=$(pwd)

cd src/apps2
echo "Listing ..."
ls -alh
clasp push --watch

cd $TOP
echo ""
echo "Please refresh App Scripts page(s) and continue deployment process from there."
echo ""

