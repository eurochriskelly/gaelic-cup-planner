#/bin/bash

TOP=$(pwd)

cd src/app
clasp push

cd $TOP
cd src/lib/eurotourno
clasp push

cd $TOP
echo ""
echo "Please refresh App Scripts page(s) and continue deployment process from there."
echo ""

