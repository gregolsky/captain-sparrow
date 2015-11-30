'use strict';

var Pushbullet = require('pushbullet');

export default class Notifications {
    constructor (settings) {
        this.settings = settings;
        var apiKey = this.settings.notifications.pushbulletApiKey;
        this.pushbullet = new Pushbullet(apiKey);
    }

    notify ({ title, message }) {
        return new Promise((resolve, reject) => {
            this.pushbullet.note(null, title, message, (err, response) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(response);
            });
        });
    }
}
