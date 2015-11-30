'use strict';

const path = require('path'),
_ = require('lodash');

const SUBTITLES_FILETYPES = [ '.txt', '.srt' ];

export default function findSubsFile (fileManager, videoPath) {
    let dir = path.dirname(videoPath),
    filename = path.basename(videoPath, path.extname(videoPath));

    let possibleSubsFiles = SUBTITLES_FILETYPES
    .map((ext) => `${ filename }${ ext }`);

    return fileManager.list(dir)
    .then(dirContents => {
        let subsFile = _.find(dirContents, name => possibleSubsFiles.indexOf(name) !== -1);
        if (!subsFile) {
            return;
        }

        return path.join(dir, subsFile);
    });
}
