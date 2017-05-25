#!/bin/bash

MESSAGE_TITLE="Download completed"
MESSAGE_CONTENT="$TR_TORRENT_NAME"

echo "Notifying on download complete $TR_TORRENT_NAME"

curl -Ss \
    -H "Access-Token: $PUSHBULLET_API_KEY" \
    -H 'Content-Type: application/json' \
    -X POST \
    --data-binary "{ \"type\": \"note\", \"body\": \"$TR_TORRENT_NAME\", \"title\": \"Download completed\" }" \
    https://api.pushbullet.com/v2/pushes
