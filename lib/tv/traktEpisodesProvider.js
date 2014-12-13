var moment = require('moment'),
_ = require('lodash');

module.exports = TraktEpisodesProvider;

function TraktEpisodesProvider(settings, dateService, traktClient) {
  this.client = traktClient;
}

TraktEpisodesProvider.prototype.getEpisodes = getEpisodes;

TraktEpisodesProvider.prototype.getYesterdayDate = getYesterdayDate;

TraktEpisodesProvider.prototype.mapResults = mapResults;

function getYesterdayDate() {
  return moment(dateService.currentDate()).add(-1, 'd');
}

function getEpisodes() {
  var self = this;
  var yesterday = self.getYesterdayDate();

  self.client.userCalendarShows(settings.traktUsername, yesterday, 2)
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

  return {
    show: showTitle,
    number: number,
    season: season,
    title: episodeTitle,
    airtime: airtime,
    runtime: runtime
  }; 
}


