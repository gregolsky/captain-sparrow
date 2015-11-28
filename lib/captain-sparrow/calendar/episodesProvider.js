module.exports = FutureEpisodesProvider;

var _ = require('lodash'),
  moment = require('moment'),
  q = require('q');

function FutureEpisodesProvider (showsNames, episodeQueries, dateService, logger) {
  this.showsNames = showsNames;
  this.episodeQueries = episodeQueries;
  this.dateService = dateService;
  this.logger = logger;
}

FutureEpisodesProvider.prototype.getEpisodes = getEpisodes;

function getEpisodes () {
  var self = this;
  var weekAgo = moment(self.dateService.currentDate()).add(-7, 'd').toDate();
  var twoWeeksInTheFuture = moment(self.dateService.currentDate()).add(30, 'd').toDate();

  var episodesPromises = _.map(self.showsNames, function (name) {
    return self.episodeQueries.getEpisodesByShowNameForTimeframe(name, weekAgo, twoWeeksInTheFuture);
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

