'use strict';

import moment from 'moment';
import logger from 'captain-sparrow/logger';

export default class CurrentEpisodesProvider {

    constructor (showsNames, episodesSinceDate, episodeQueries, dateService) {
        this.showsNames = showsNames;
        this.episodesSinceDate = episodesSinceDate;
        this.episodeQueries = episodeQueries;
        this.dateService = dateService;
    }

    getEpisodes () {
        var yesterday = moment(this.dateService.currentDate()).add(-1, 'd').toDate();
        var since = this.episodesSinceDate || yesterday;

        var episodesPromises = this.showsNames.map(name =>
            this.episodeQueries.getEpisodesByShowNameForTimeframe(name, since, this.dateService.currentDateTime()));

        return Promise.allSettled(episodesPromises)
        .then(results => {
            var allEpisodes = [];

            results.forEach((showEpisodesResult, i) => {
                if (showEpisodesResult.state === 'fulfilled') {
                    logger.info(`${ showEpisodesResult.value.length } episodes found for ${ this.showsNames[i] }.`)
                    allEpisodes = allEpisodes.concat(showEpisodesResult.value);
                }
                else {
                    var reason = showEpisodesResult.reason.stack || showEpisodesResult.reason;
                    logger.error(this.showsNames[i] + '\n' + reason);
                }
            });

            return allEpisodes;
        });
    }

}
