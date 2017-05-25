#!/bin/bash

SESSION_RESPONSE=$(curl localhost:9091/transmission/rpc 2>/dev/null)
SESSION_ID_REGEX='(X-Transmission-Session-Id\: )([^<]*)'
TORRENT_ID=$TR_TORRENT_ID
TORRENT_NAME=$TR_TORRENT_NAME

if [[ $SESSION_RESPONSE =~ $SESSION_ID_REGEX ]]; then
    SESSION_ID=${BASH_REMATCH[2]}
else
    exit 1
fi

TORRENT_DELETE_PAYLOAD="{\"method\": \"torrent-remove\", \"arguments\": { \"ids\" : "$TORRENT_ID" } }"
curl -sS -H "X-Transmission-Session-Id: $SESSION_ID" -d "$TORRENT_DELETE_PAYLOAD"  http://localhost:9091/transmission/rpc && echo "Torrent removed $TORRENT_NAME"