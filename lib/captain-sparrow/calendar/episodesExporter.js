'use strict';

const createICal = require('ical-generator');
const moment = require('moment');

export default class EpisodesICalExporter {

    constructor (exportFilePath) {
        this.exportFilePath = exportFilePath;
    }

    export (episodes) {
        var ical = createICal();

        episodes.forEach((e, i) => {
            ical.addEvent({
                start: e.airtime,
                end: moment(e.airtime)
                .add(e.runtime, 'm')
                .toDate(),
                summary: e.describe() + ' ' + e.title
            });
        });

        return new Promise((resolve, reject) => {
            ical.save(this.exportFilePath, err => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    };
}
