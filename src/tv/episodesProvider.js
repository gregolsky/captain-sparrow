'use strict';

const moment = require('moment');
const EpisodeProviderStream = require('./episodeProviderStream');

class CurrentEpisodesProvider {

    constructor(showsNames, episodesSinceDate, episodeQueries, dateService) {
        this.showsNames = showsNames;
        this.episodesSinceDate = episodesSinceDate;
        this.episodeQueries = episodeQueries;
        this.dateService = dateService;
    }

    getEpisodes() {
        var yesterday = moment(this.dateService.currentDate()).add(-1, 'd').toDate();
        var since = this.episodesSinceDate || yesterday;

        const query = () => this.showsNames
            .map(name => {
                const promise = this.episodeQueries.getEpisodesByShowNameForTimeframe(
                    name, since, this.dateService.currentDateTime());
                return { name, promise };
            });

        return new EpisodeProviderStream(query);
    }

}

module.exports = CurrentEpisodesProvider;
