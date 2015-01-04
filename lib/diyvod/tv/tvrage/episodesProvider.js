var _ = require('lodash');

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
  var since = self.settings.tv.episodesSince || self.getYesterdayDate();
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
    .then(function (showInfo) {
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
      if (!response.Results == 0) {
        throw new Error('Show ' + showName + ' was not found in TvRage.');
      }

      return self.tvRage.showInfo(response.Results.show[0].showid);
    });
}

// TODO: test it
function mapEpisodes(showInfo, seasons) {
  var self = this;
  var show = showInfo.showname;
  var runtime = parseInt(showInfo.runtime);
  
  var airtime = showInfo.airtime;
  var timezone = showInfo.timezone;

  _(seasons)
    .map(function (season) {

    });


}



