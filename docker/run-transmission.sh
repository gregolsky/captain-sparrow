#!/bin/bash

if [[ -z "$1" ]]
then
    MAIN_DIR="test"
else
    MAIN_DIR="$1"
fi

CONFIG_DIR="$MAIN_DIR/transmission/config"
DOWNLOADS_DIR="$MAIN_DIR/transmission/downloads"
WATCH_DIR="$MAIN_DIR/transmission/watch"

mkdir -p $CONFIG_DIR
mkdir -p $DOWNLOADS_DIR
mkdir -p $WATCH_DIR

docker run -it --rm \
-v $(readlink -f $CONFIG_DIR):/config \
-v $(readlink -f $DOWNLOADS_DIR):/downloads \
-e PGID=$(id -g) -e PUID=$(id -u) \
-e TZ="Europe/Warsaw" \
-p 51413/udp \
linuxserver/transmission

#lsioarmhf/transmission
#-p 9091 -p 51413 -p 44441:44441 \