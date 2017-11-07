#!/bin/bash
PUID=$(id -u) PGID=$(id -g) 
export PUID
export PGID
pushd compose

cp assets/download-completed.sh transmission
cp assets/remove-torrent.sh transmission
cp assets/notify.sh transmission
cp secrets/transmission-settings.json transmission/settings.json
ls -al transmission
docker-compose up && popd
