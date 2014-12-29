
var _ = require('lodash'),
q = require('q'),
winston = require('winston');

module.exports = TvShowsDownload;

function TvShowsDownload(
  settings, 
  episodesProvider,
  episodeDownloader,
  logger) {
    this.settings = settings;
    this.episodesProvider = episodesProvider;
    this.episodeDownloader = episodeDownloader;
    this.logger = logger;
  }

  TvShowsDownload.prototype.execute = execute;
  TvShowsDownload.prototype.downloadEpisodes = downloadEpisodes;
  TvShowsDownload.prototype.describeResults = describeResults;

  function execute () {
    var self = this;

    self.episodesProvider.getEpisodes()
    .then(function (episodes) { 
      return self.downloadEpisodes(episodes)
      .then(function (results) {
        self.describeResults(episodes, results);
      });
    })
  }

  function downloadEpisodes (episodes) {
    var downloadPromises = _.map(episodes, function (episode) {
      return self.episodeDownloader.download(episode);
    });

    return q.allSettled(downloadPromises);
  }

  function describeResults(episodes, results) {
    var self = this;

    if (!episodes.length) {
      self.logger.info('No episodes in the selected timespan');
      return;
    }

    results.forEach(function (result, i) {
      if (result.state === "fulfilled") {
        self.logger.info(episodes[i].show + ' ' + episodes[i].getEpisodeNumber() + ': OK');
      } else {
        var reason = result.reason;
        self.logger.info(episodes[i].show + ' ' + episodes[i].getEpisodeNumber() + ': ' + reason);
      }
    });
  }


