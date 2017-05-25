#!/bin/bash

echo "Torrent done ${TR_TORRENT_NAME}"
/config/remove-torrent.sh
/config/notify.sh
#eval $NODE /home/gregolsky/scripts/pushbullet.js "Download completed" "$TORRENT_NAME"
