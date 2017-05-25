#!/bin/bash

if [[ ! -z "$DEBUG" ]]
then
    debugOpt="bash"
fi

if [[ -z "$CAPTAIN_SPARROW_CONFIG" ]]; then
    CAPTAIN_SPARROW_CONFIG="$(pwd)/test/captain-sparrow-config.json"
fi

if [[ -z "$DOWNLOAD_DIR" ]]; then
    DOWNLOAD_DIR="$(pwd)/test/downloads"
fi

docker run -it --rm \
    -v $CAPTAIN_SPARROW_CONFIG:/opt/captain-sparrow-config.json \
    -v $DOWNLOAD_DIR:/downloads \
    gregolsky/captain-sparrow:cron $debugOpt
