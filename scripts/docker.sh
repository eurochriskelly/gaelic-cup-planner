#!/bin/bash 

run () {
  docker run -d \
    -p 1234:1234 \
    -p 1235:1235 \
    -p 1236:1236 \
    -p 4000:4000 \
    -p 4001:4001 \
    -p 4002:4002 \
    -p 5000:5000 \
    -p 5001:5001 \
    --name gge-instance gge-app
}

build() {
  docker build -t gge-app .
}

# loop over all arguments and execute them.
# If --run is passed, run the run function
# If --build is passed, run the build function
if [ $# -eq 0 ]; then
  echo "No arguments provided"
  exit 1
fi
while [ "$#" -gt 0 ]; do
  case "$1" in
    --run)
      run
      ;;
    --build)
      build
      ;;
    --stop)
      docker stop gge-instance
      ;;
    --rm)
      docker rm gge-instance
      ;;
    --login)
      docker exec -it gge-instance /bin/bash
      ;;
    *)
      echo "Invalid argument: $1"
      ;;
  esac
  shift
done
