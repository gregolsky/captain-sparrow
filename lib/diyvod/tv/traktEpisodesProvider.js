var moment = require('moment'),
_ = require('lodash'),
Episode = require('./episode');

module.exports = TraktEpisodesProvider;

function TraktEpisodesProvider(settings, dateService, traktClient) {
  this.settings = settings;
  this.client = traktClient;
  this.dateService = dateService;
}

TraktEpisodesProvider.prototype.getEpisodes = getEpisodes;

TraktEpisodesProvider.prototype.getYesterdayDate = getYesterdayDate;

TraktEpisodesProvider.prototype.mapResults = mapResults;

function getYesterdayDate() {
  return moment(this.dateService.currentDate()).add(-1, 'd').toDate();
}

function getEpisodes() {
  var self = this;
  var since = self.settings.tv.episodesSince || self.getYesterdayDate();
  var days =  moment.duration(moment(self.dateService.currentDate()) - moment(since)).days() + 1;

  return self.client.userCalendarShows(self.settings.trakt.username, since, days)
  .then(function(data){
    return self.mapResults(data);
  });
}

function mapResults(data) {
  return _(data)
  .map(mapForDate)
  .flatten()
  .value();  
}

function mapForDate (dateData) {
  return _.map(dateData['episodes'], mapEpisode);
}

function mapEpisode(data) {
  var episode = data['episode'];
  var show = data['show'];
  var number = parseInt(episode['number']);
  var season = parseInt(episode['season']);
  var episodeTitle = episode['title'];
  var showTitle = show['title'];
  var airtime = moment(episode['first_aired_iso']).toDate();
  var runtime = parseInt(show['runtime']);

  return new Episode(showTitle, number, season, episodeTitle, airtime, runtime);
}


