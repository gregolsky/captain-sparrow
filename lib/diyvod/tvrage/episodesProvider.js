var _ = require('lodash'),
moment = require('moment'),
q = require('q'),
Episode = require('../tv/episode'),
normalize = require('../normalize');

module.exports = TvRageEpisodesProvider;

function TvRageEpisodesProvider(showsNames, episodesSinceDate, tvRage, dateService, logger) {
  this.showsNames = showsNames;
  this.episodesSinceDate = episodesSinceDate;
  this.tvRage = tvRage;
  this.dateService = dateService;
  this.logger = logger;
}

TvRageEpisodesProvider.prototype.getEpisodes = getEpisodes;
TvRageEpisodesProvider.prototype.getShowInfo = getShowInfo;
TvRageEpisodesProvider.prototype.getEpisodesForShow = getEpisodesForShow;
TvRageEpisodesProvider.prototype.mapEpisodes = mapEpisodes;

TvRageEpisodesProvider.prototype.getEpisodeListAndShowInfo = getEpisodeListAndShowInfo;

function getEpisodes() {
  var self = this;
  var yesterday = moment(self.dateService.currentDate()).add(-1, 'd').toDate();
  var since = self.episodesSinceDate || yesterday;

  var episodesPromises = _.map(self.showsNames, function (name) {
    return self.getEpisodesForShow(name);
  });

  return q.allSettled(episodesPromises)
  .then(function (results) {
     // TODO hacky way to save cache
    return self.tvRage.save()
      .then(function () {
        return results;
      });
  })
  .then(function (results) {

    var allEpisodes = [];

    _.each(results, function (showEpisodesResult, i) {

      if (showEpisodesResult.state == 'fulfilled') {
        allEpisodes = allEpisodes.concat(showEpisodesResult.value);
      }
      else {
        var reason = showEpisodesResult.reason.stack || showEpisodesResult.reason;
        self.logger.error(self.showsNames[i] + '\n' + reason);
      }

    });

    return _.filter(allEpisodes, function (e) {
      return e.airtime > since && e.airtime < self.dateService.currentDateTime();
    });
  });
}

function getEpisodesForShow(showName) {
  var self = this;
  return self.getShowInfo(showName)
  .then(function (showInfoResponse) {
    var showInfo = showInfoResponse.Showinfo;
    return self.getEpisodeListAndShowInfo(showInfo);
  })
  .then(function (result) {
      return self.mapEpisodes(result.showInfo, result.episodeList);
  });
}

function getEpisodeListAndShowInfo(showInfo) {
  var self = this;
  return self.tvRage.episodeList(showInfo.showid)
    .then(function (episodeListResponse) {
      return {
          showInfo: showInfo,
          episodeList: episodeListResponse.Show.Episodelist[0].Season
      };
    });
}

function getShowInfo(showName) {
  var self = this;
  return self.tvRage.search(showName)
  .then(function (response) {
    if (response.Results == 0) {
      throw new Error('Show ' + showName + ' was not found in TvRage.');
    }

    return self.tvRage.showInfo(response.Results.show[0].showid);
  });
}

function mapEpisodes(showInfo, seasons) {
  var self = this;
  var show = showInfo.showname[0];
  var runtime = parseInt(showInfo.runtime);

  var airtime = showInfo.airtime;
  var timezone = showInfo.timezone;

  return _(seasons)
  .map(function (season) {
    return _.map(season.episode, function (episode) {
      var number = parseInt(episode.seasonnum[0]);
      var seasonNr = parseInt(season.$.no);
      var title = episode.title[0];
      var airtime = combineAirTime(showInfo, episode);
      var runtime = parseInt(showInfo.runtime[0]);
      return new Episode(show, number, seasonNr, title, airtime, runtime);
    });
  })
  .flatten()
  .value();
}

function combineAirTime(showInfo, episode) {
  var tzinfo = showInfo.timezone[0].match(/GMT(\+|-)([0-9]+)/).slice(1);
  var tzString = tzinfo[0] + normalize.padLeft('00', tzinfo[1]) + ':00';
  var airtimeString = episode.airdate[0] + 'T' + showInfo.airtime[0] + tzString;
  var airtime = moment.parseZone(airtimeString).toDate();
  return airtime;

}



