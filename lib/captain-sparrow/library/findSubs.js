'use strict';

import path from 'path';
import * as fs from 'captain-sparrow/fs';

const SUBTITLES_FILETYPES = [ '.txt', '.srt' ];

export default function findSubsFile (videoPath) {
    let dir = path.dirname(videoPath);
    let filename = path.basename(videoPath, path.extname(videoPath));

    let possibleSubsFiles = SUBTITLES_FILETYPES
        .map((ext) => `${ filename }${ ext }`);

    return fs.readdir(dir)
    .then(dirContents => {
        let subsFile = dirContents.find(name =>
                possibleSubsFiles.indexOf(name) !== -1);
        if (!subsFile) {
            return;
        }

        return path.join(dir, subsFile);
    });
}
