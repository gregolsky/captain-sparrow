'use strict';

const { normalizeName } = require('../normalize');

class SearchTermFormatter {

    constructor(settings) {
        this.settings = settings;
    }

    formatSearchTerm(episode) {
        var showNormalized = normalizeName(episode.show);
        return `${ showNormalized } ${ episode.getEpisodeNumber() } ${ this.settings.tv.searchSuffix }`;
    }

}

module.exports = SearchTermFormatter;
