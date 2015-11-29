'use strict';

let {
    exec
} = require('child_process');

export default class SubtitlesDownloader {

    constructor (settings, library) {
        this.library = library;
        this.settings = settings;
    }

    downloadMissingSubtitles () {
        return this.library.listEntriesWithoutSubtitles()
        .then(videoPaths => {
            let downloadSubtitles = configureDownloadSubtitles(this.settings.subs.command);
            let subtitlesDownloadPromises = videoPaths.map(p => downloadSubtitles(p));
            return Promise.all(subtitlesDownloadPromises);
        });
    }

}

function configureDownloadSubtitles (command) {
    return function downloadSubtitles (videoPath) {
        return new Promise((resolve, reject) => {
            exec(`${ command } ${ videoPath }`, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                }
            });
        });
    };
}
