'use strict';

import { normalizeName } from 'captain-sparrow/normalize';

export default class SearchTermFormatter {

    constructor (settings) {
        this.settings = settings;
    }

    formatSearchTerm (episode) {
        var showNormalized = normalizeName(episode.show);
        return `${ showNormalized } ${ episode.getEpisodeNumber() } ${ this.settings.tv.searchSuffix }`;
    }

}
