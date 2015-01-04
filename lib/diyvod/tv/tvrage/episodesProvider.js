var _ = require('lodash'),
    moment = require('moment'),
    q = require('q'),
    Episode = require('../episode'),
    normalize = require('../../normalize');

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

function getEpisodes() {
  var self = this;
  var since = self.episodesSinceDate || self.getYesterdayDate();
  var days =  moment.duration(moment(self.dateService.currentDate()) - moment(since)).days() + 1;

  var episodesPromises = _.map(self.showsNames, function (name) {
    return self.getEpisodesForShow(name);
  });

  return q.allSettled(episodesPromises)
    .then(function (results) {
      // log errors, pass the results
    });
}

function getEpisodesForShow(showName) {
  var self = this;
  return self.getShowInfo(showName)
    .then(function (showInfoResponse) {
      var showInfo = showInfoResponse.Showinfo;
      return self.tvRage.episodeList(showInfo.showid)
        .then(function (episodeListResponse) {
          return self.mapEpisodes(showInfo, episodeListResponse.Show.Episodelist[0]);
        });
    })
    .then(function (episodes) {
      return self.filterBySinceDate(episodes);
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

        var tz = showInfo.timezone[0];
        var tzinfo = tz.match(/GMT(\+|-)([0-9]+)/).slice(1);
        var tzString = tzinfo[0] + normalize.padLeft('00', tzinfo[1]) + ':00';
        var airtimeString = episode.airdate[0] + 'T' + showInfo.airtime[0] + tzString;
        var airtime = moment.parseZone(airtimeString).toDate();
        
        var runtime = parseInt(showInfo.runtime[0]);
        return new Episode(show, number, seasonNr, title, airtime, runtime);
      });
    })
    .flatten()
    .value();
}



