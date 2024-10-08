#!/bin/bash 

instance=$(docker ps --filter ancestor=gaelic-cup-planner-react-app --format "{{.Names}}")
run () {
  docker-compose -f docker-compose.dev.yml up --build
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
      docker stop $instance
      ;;
    --rm)
      docker rm $instance
      ;;
    --login)
      docker exec -it $instance /bin/bash
      ;;
    *)
      echo "Invalid argument: $1"
      ;;
  esac
  shift
done
