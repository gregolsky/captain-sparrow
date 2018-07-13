#!/bin/sh
# start-cron.sh

rsyslogd
cron
touch /var/log/cron.log
tail -f /var/log/cron.log