'use strict';

var _ = require('lodash');
const VIDEO_FILETYPES = [ '.mkv', '.mp4', '.avi' ];

export default class TvShowsLibrary {

    constructor(settings, fileManager) {
        this.settings = settings;
        this.fileManager = fileManager;
        this.filenames = null;
        this.paths = null;
    }


    initialize () {
        return this.fileManager.listTree(this.settings.tv.libraryPath, this.filterFile.bind(this))
        .then((paths) => {
            this.paths = paths;
            this.filenames = _.map(paths, (f) => this.fileManager.base(f));
        });
    }

    contains (episode) {
        return _.some(this.filenames, (filename) => episode.isMatch(filename));

    }

    filterFile (path, stat) {
        var extension = this.fileManager.extension(path);
        return stat.isFile() && VIDEO_FILETYPES.some((ext) => ext == extension);
    }

    listWithoutSubtitles() {
        return (this.paths || [])
        .filter((f) => {
            // TODO
            // cut the extension
            // check if there's a srt or txt file with the same name
            return true;
        });
    }

}
