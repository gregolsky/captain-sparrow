
var _ = require('lodash'),
q = require('q');

function TvShowsDownloadStrategy(
  settings, 
  episodesProvider,
  torrentSearchClient,
  downloader,
  episodeFilter,
  torrentFilter) {
    this.settings = settings;
    this.episodesProvider = episodesProvider;
    this.downloader = downloader;
    this.torrentSearchClient = torrentSearchClient;
    this.episodeFilter = episodeFilter;
    this.torrentFilter = torrentFilter;
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

    return self.episodeFilter.filter(episode)
    .then(function (isFilteredOut) {
      if (isFilteredOut) {
        throw { 
          episode: episode, 
          reason: 'filtered out' 
        };
      }

      var torrents = self.torrentSearchClient.search(episode);
      var filteredTorrents = _.filter(torrents, self.torrentFilter.filter.bind(self.torrentFilter));

      if (!filteredTorrents.length) {
        throw { 
          episode: episode, 
          reason: 'not found' 
        };
      }

      self.downloader.download(filteredTorrents[0]);
    });

    // TODO filter torrents
    // TODO download


  }

