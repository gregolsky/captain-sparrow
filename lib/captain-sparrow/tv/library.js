'use strict';

const path = require('path');

const VIDEO_FILETYPES = [ '.mkv', '.mp4', '.avi' ];
const SUBTITLES_FILETYPES = [ '.txt', '.srt' ];

export default class TvShowsLibrary {

    constructor (settings, fileManager) {
        this.settings = settings;
        this.fileManager = fileManager;
        this.entries = null;
    }

    initialize () {
        return this.fileManager.listTree(this.settings.tv.libraryPath, filterFile)
        .then((paths) => {
            let entriesPromises = paths.map((p) => {
                return findSubsFile(this.fileManager, p)
                .then((subsPath) => {
                    return new Entry({
                        videoPath: p,
                        subsPath
                    });
                });
            });

            return Promise.all(entriesPromises);
        })
        .then(entries => {
            this.entries = entries;
        });
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

function findSubsFile (fileManager, videoPath) {
    let dir = path.dirname(videoPath),
    subsFileName = path.basename(videoPath, path.extname(videoPath));

    let possibleSubsFiles = SUBTITLES_FILETYPES
    .map((ext) => path.join(dir, `${ subsFileName }${ ext }`));

    return fileManager.list(dir)
    .then(dirContents => {
        return dirContents.find(name => possibleSubsFiles.indexOf(name) !== -1);
    });
}

function filterFile (filename, stat) {
    return stat.isFile() && VIDEO_FILETYPES.some((ext) => ext === path.extname(filename));
}
