'use strict';

var Transmission = require('transmission');

export default class TransmissionClient {

    constructor (settings) {
        this.settings = settings;
    }

    list () {
        return new Promise((resolve, reject) => {
            try {
                this.buildClient()
                .get((err, arg) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(arg.torrents);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    };

    addUrl (url, downloadDir) {
        return new Promise((resolve, reject) => {
            try {
                let client = this.buildClient();
                client.addUrl(
                    url,
                    { 'download-dir': downloadDir },
                    (err, arg) => {
                        if (err) {
                            reject(err);
                        }

                        resolve(arg);
                    });
            }
            catch (err) {
                reject(err);
            }
        });
    };

    buildClient () {
        return new Transmission(this.settings.transmission);
    };

    contains (episode) {
        return this.list()
        .then(queue =>
            queue.some(
                entry => episode.isMatch(entry.name)));
    };

}
