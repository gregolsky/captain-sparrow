
var _ = require('lodash'),
q = require('q'),
moment = require('moment');

function EpisodesFilter(
  settings,
  downloader,
  library,
  dateService) {
    this.settings = settings;
    this.downloader = downloader;
    this.library = library;
    this.dateService = dateService;
  }

  EpisodesFilter.prototype.filter = function (episode) {
    var self = this;

    return self.library.contains(episode)
    .then(function (libraryContains) {

      if (libraryContains) {
        throw false;
      }

      return self.downloader.contains(episode);
    })
    .then(function (downloadQueueContains) {
      return !downloadQueueContains && 
        self.isFewHoursAfterAirTime(episode);
    })
    .catch(function (errResult) {
      if (errResult === false) {
        return false;
      }

      throw errResult;
    });
  }

  EpisodesFilter.prototype.isFewHoursAfterAirTime = function (episode) {
    var self = this;

    var downloadTime = moment(episode.airtime)
    .add(self.settings.hoursAfterAirTime, 'h')
    .toDate() 

    return downloadTime <= self.dateService.currentDate();
  }

  module.exports = EpisodesFilter;
