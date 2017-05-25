#FROM resin/raspberrypi-node:latest
FROM node

ADD https://github.com/gregolsky/captain-sparrow/archive/docker.zip /opt/captain-sparrow.zip

RUN apt-get update \
    && apt-get install --no-install-recommends unzip cron qnapi rsyslog -y \
    && cd /opt \
    && unzip captain-sparrow.zip \
    && mv captain-sparrow-docker captain-sparrow \
    && rm captain-sparrow.zip \
    && cd captain-sparrow \
    && npm install \
    && npm run build

ADD crontab /etc/cron.d/captain-sparrow
RUN chmod 0644 /etc/cron.d/captain-sparrow \
    && touch /var/log/cron.log \
    && apt-get remove unzip -y \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/* \
    && echo "Ahoy!" > /var/log/cron.log 

VOLUME /downloads /library /opt/captain-sparrow-config.json
ADD start.sh /opt/start.sh

CMD /opt/start.sh 