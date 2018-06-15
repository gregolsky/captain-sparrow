'use strict';

const path = require('path');
const { readdirAsync } = require('../util/fs');

const SUBTITLES_FILETYPES = [ '.txt', '.srt' ];

module.exports = function findSubsFile(videoPath) {
    let dir = path.dirname(videoPath);
    let filename = path.basename(videoPath, path.extname(videoPath));

    let possibleSubsFiles = SUBTITLES_FILETYPES
        .map((ext) => `${ filename }${ ext }`);

    return readdirAsync(dir)
        .then(dirContents => {
            let subsFile = dirContents.find(name =>
                possibleSubsFiles.indexOf(name) !== -1);
            if (!subsFile) {
                return;
            }

            return path.join(dir, subsFile);
        });
}

