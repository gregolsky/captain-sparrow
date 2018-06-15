'use strict';

var Pushbullet = require('pushbullet');

class Notifications {
    constructor(settings) {
        this.pushbullet = new Pushbullet(settings.notifications.pushbulletApiKey);
    }

    notify({ title, message }) {
        return new Promise((resolve, reject) => {
            this.pushbullet.note(null, title, message, (err, response) => {
                err ? reject(err) : resolve();
            });
        });
    }
}

module.exports = Notifications;

