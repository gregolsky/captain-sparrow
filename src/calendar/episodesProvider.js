'use strict';

const moment = require('moment');
const logger = require('../logger');

class FutureEpisodesProvider {

    constructor(showsNames, episodeQueries, dateService) {
        this.showsNames = showsNames;
        this.episodeQueries = episodeQueries;
        this.dateService = dateService;
    }

    getEpisodes() {
        var weekAgo = moment(this.dateService.currentDate()).add(-7, 'd').toDate();
        var twoWeeksInTheFuture = moment(this.dateService.currentDate()).add(30, 'd').toDate();

        var episodesPromises = this.showsNames.map(name => {
            return this.episodeQueries.getEpisodesByShowNameForTimeframe(name, weekAgo, twoWeeksInTheFuture);
        });

        return Promise.allSettled(episodesPromises)
            .then(results => {
                var allEpisodes = [];

                results.forEach((showEpisodesResult, i) => {
                    if (showEpisodesResult.state === 'fulfilled') {
                        allEpisodes = allEpisodes.concat(showEpisodesResult.value);
                        return;
                    }

                    var reason = showEpisodesResult.reason.stack || showEpisodesResult.reason;
                    logger.error(this.showsNames[i] + '\n' + reason);
                });

                return allEpisodes;
            });
    }

}

module.exports = FutureEpisodesProvider;
