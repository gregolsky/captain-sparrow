'use strict';

import { execFile } from 'child_process';
import path from 'path';
import VError from 'verror';
import findSubs from 'captain-sparrow/library/findSubs';
import logger from 'captain-sparrow/logger';

export default class SubtitlesDownloader {

    constructor (settings, library, notifications) {
        this.library = library;
        this.settings = settings;
        this.notifications = notifications;
    }

    downloadMissingSubtitles () {
        return Promise.when(this.library.listEntriesWithoutSubtitles())
        .then(videoPaths => {
            let downloadSubtitles = configureDownloadSubtitles(this.settings.subs.command, this.settings.subs.commandArgs);
            let subtitlesDownloadPromises = videoPaths.map(p => {
                return downloadSubtitles(p)
                .then(() => findSubs(p))
                .then((result) => {
                    if (!result) {
                        return;
                    }

                    return this.notifications.notify({
                        title: `Subtitles downloaded for ${ path.basename(p) }`
                    });
                })
                .catch(err => {
                    logger.error(`Error downloading subtitles for ${ p }.`, err.stack);
                });
            });

            return Promise.all(subtitlesDownloadPromises);
        });
    }

}

function configureDownloadSubtitles (command, commandArgs) {
    return function downloadSubtitles (videoPath) {
        return new Promise((resolve, reject) => {
            let args = commandArgs.concat([ videoPath ]);

            execFile(command, args, (err, stdout, stderr) => {
                if (err) {
                    let msg = formatErrorMessage({
                        command,
                        args: args,
                        stdout,
                        stderr
                    });

                    reject(new VError(err, msg));

                    return;
                }

                resolve();
            });
        });
    };
}

function formatErrorMessage ({ command, args, stdout, stderr }) {
    var result = `Command '${ command } ${ args.join(' ') }' failed.`;

    if (stdout) {
        result += `\nSTDOUT: ${ stdout }`;
    }

    if (stderr) {
        result += `\nSTDERR: ${ stderr }`;
    }

    return result;
}
