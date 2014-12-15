
var _ = require('lodash'),
q = require('q'),
searchTermFormatter = require('./searchTerm');

function TvShowsDownloadStrategy(
  settings, 
  episodesProvider,
  torrentSearchClient,
  downloader) {
    this.settings = settings;
    this.episodesProvider = episodesProvider;
    this.downloader = downloader;
    this.torrentSearchClient = torrentSearchClient;
  }

  TvShowsDownloadStrategy.prototype.execute = execute;
  TvShowsDownloadStrategy.prototype.tryDownloadEpisode = tryDownloadEpisode;
  TvShowsDownloadStrategy.prototype.downloadEpisodes = downloadEpisodes;

  function execute () {
    var self = this;

    self.episodesProvider.getEpisodes()
      .then(function (episodes) { 
        return self.downloadEpisodes(episodes);
      });
  }

  function downloadEpisodes (episodes) {
    var downloadPromises = _.map(episodes, function (episode) {
      return self.tryDownloadEpisode(episode);
    });
    return q.allSettled(downloadPromises);
  }

  function tryDownloadEpisode (episode) {
    var self = this;

    self.episodesFilter.filter(episode)
    .then(function (isFilteredOut) {
      if (isFilteredOut) {
        return;
      }

      var term = searchTermFormatter.buildSearchTerm(episode);
      var torrents = this.torrentSearchClient.search(term);

    });

    // TODO filter torrents
    // TODO download


  }

