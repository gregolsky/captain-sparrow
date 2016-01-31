'use strict';

var normalize = include('normalize');

export default class SearchTermFormatter {

    constructor (settings) {
        this.settings = settings;
    }

    formatSearchTerm (episode) {
        var showNormalized = normalize.normalizeName(episode.show);
        var term = showNormalized +
            ' ' +
            episode.getEpisodeNumber() +
            ' ' +
            this.settings.tv.searchSuffix;
        return term;
    }

}
