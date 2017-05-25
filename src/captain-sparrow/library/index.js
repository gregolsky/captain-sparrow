'use strict';

import path from 'path';
import findSubsFile from './findSubs';

import * as fs from 'captain-sparrow/fs';

const VIDEO_FILETYPES = [ '.mkv', '.mp4', '.avi' ];

export default class TvShowsLibrary {

    constructor (settings) {
        this.settings = settings;
        this.entries = null;
    }

    initialize () {
        return this._getAllVideoFiles(this.settings.tv.libraryPath)
        .then(paths => {
            let entriesPromises = paths.map(videoPath => {
                return findSubsFile(videoPath)
                .then(subsPath => (new Entry({
                        videoPath,
                        subsPath
                    })));
            });

            return Promise.all(entriesPromises);
        })
        .then(entries => {
            this.entries = entries;
        });
    }

    _getAllVideoFiles(dir) {
        return fs.walk(dir, filterFile);
    }

    contains (episode) {
        return this.entries.some(entry => episode.isMatch(entry.filename));
    }

    listEntriesWithoutSubtitles () {
        return this.entries.filter(e => !e.hasSubtitles)
        .map(e => e.path);
    }

}

class Entry {

    constructor ({ videoPath, subsPath }) {
        this.path = videoPath;
        this.subsPath = subsPath;
    }

    get filename () {
        return path.basename(this.path);
    }

    get hasSubtitles () {
        return !!this.subsPath;
    }

}

function filterFile (filename, stat) {
    return stat.isFile() && VIDEO_FILETYPES.some((ext) => ext === path.extname(filename));
}
