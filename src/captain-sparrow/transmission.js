'use strict';

import Transmission from 'transmission';

export default class TransmissionClient {

    constructor (settings) {
        if (!settings || !settings.host || !settings.port) {
            throw new Error('Invalid transmission settings.');
        }

        this.settings = settings;
    }

    list () {
        return new Promise((resolve, reject) => {
            try {
                this.buildClient()
                    .get((err, arg) => err ? reject(err) : resolve(arg.torrents));
            } catch (err) {
                reject(err);
            }
        });
    };

    addUrl (url, downloadDir) {
        if (!url) {
            return Promise.reject(new Error(`Invalid URL: ${ url }`));
        }

        if (!downloadDir) {
            return Promise.reject(new Error(`Invalid download dir: ${ downloadDir }`));
        }

        return new Promise((resolve, reject) => {
            try {
                let client = this.buildClient();
                client.addUrl(
                    url,
                    { 'download-dir': downloadDir },
                    (err, arg) => err ? reject(err) : resolve(arg));
            } catch (err) {
                reject(err);
            }
        });
    };

    buildClient () {
        return new Transmission(this.settings);
    };

    contains (episode) {
        return this.list()
        .then(queue =>
            queue.some(entry => episode.isMatch(entry.name)));
    };

}
