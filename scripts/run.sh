#!/bin/bash

# There are 2 sites: mobile and desktop
# Each site can do the following:
# 1. Build frontend (prd)
# 1.1. Build frontend while watching
# 2. Launch backend (prd)
# 2.1 Launch backend but relaunch if changes are detected

# The commands for the above steps are
#  build:fe
#  build:fe:dev
#  launch:be
#  launch:be:dev

run() {
  # if --dev is passed the add set $suffix to :dev
  local suffix=""
  if [ "$1" == "--dev" ]; then
    suffix=":dev"
  fi
  local cfg="vite.config-${site}.js"
  if [ ! -f "$cfg" ]; then
    echo "Config file $cfg not found"
    exit 1
  fi

  if [ "$mode" == "dev" ]; then
    vite --config $cfg &
    bash scripts/launch.sh --port $port --app $site --watch &
  else
    vite build --config $cfg &
    bash scripts/launch.sh --port $port --app $site &
  fi

  echo "Waiting until complete ..."
  wait
}

# process switches in the format --foo bar --baz as $foo=bar and $baz=true
mode="production"
while [ "$1" != "" ]; do
  case $1 in
    --dev)
      mode="dev"
      dev=true
      shift
      ;;

    --mobile)
      selected=true
      site=mobile
      port=4000
      mobile=true
      ;;
      
    --desktop)
      selected=true
      site=desktop
      port=4001
      desktop=true
      ;;

    * ) 
      echo "Invalid argument $1"
      exit 1
      ;;
  esac
  shift
done

# If nothing was passed ask the user to select a site
if "$selected"; then
  echo "Selected site [$site] site in [$mode] mode"
else
  # If no site is selected offer teh user to choose
  echo "Please select a site to run"
  select site in mobile desktop;do
    echo "Selected site [$site] site in [$mode] mode"
    break
  done
fi

run "$@"
