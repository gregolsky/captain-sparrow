
var _ = require('lodash'),
q = require('q');

function TvShowsDownloadStrategy(
  settings, 
  episodesProvider,
  episodeDownloader) {
    this.settings = settings;
    this.episodesProvider = episodesProvider;
    this.episodeDownloader = episodeDownloader;
  }

  TvShowsDownloadStrategy.prototype.execute = execute;
  TvShowsDownloadStrategy.prototype.downloadEpisodes = downloadEpisodes;

  function execute () {
    var self = this;

    self.episodesProvider.getEpisodes()
      .then(function (episodes) { 
        return self.downloadEpisodes(episodes);
      });
    // TODO log errors
  }

  function downloadEpisodes (episodes) {
    var downloadPromises = _.map(episodes, function (episode) {
      return self.episodeDownloader.download(episode);
    });

    return q.allSettled(downloadPromises);
  }


