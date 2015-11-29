module.exports = CurrentEpisodesProvider;

var _ = require('lodash'),
moment = require('moment'),
q = require('q');

function CurrentEpisodesProvider (showsNames, episodesSinceDate, episodeQueries, dateService, logger) {
    this.showsNames = showsNames;
    this.episodesSinceDate = episodesSinceDate;
    this.episodeQueries = episodeQueries;
    this.dateService = dateService;
    this.logger = logger;
}

CurrentEpisodesProvider.prototype.getEpisodes = getEpisodes;

function getEpisodes () {
    var self = this;
    var yesterday = moment(self.dateService.currentDate()).add(-1, 'd').toDate();
    var since = self.episodesSinceDate || yesterday;

    var episodesPromises = _.map(self.showsNames, function (name) {
        return self.episodeQueries.getEpisodesByShowNameForTimeframe(name, since, self.dateService.currentDateTime());
    });

    return q.allSettled(episodesPromises)
    .then(function (results) {
        var allEpisodes = [];

        _.each(results, function (showEpisodesResult, i) {
            if (showEpisodesResult.state === 'fulfilled') {
                allEpisodes = allEpisodes.concat(showEpisodesResult.value);
            }
        else {
                var reason = showEpisodesResult.reason.stack || showEpisodesResult.reason;
                self.logger.error(self.showsNames[i] + '\n' + reason);
            }
        });

        return allEpisodes;
    });
}
