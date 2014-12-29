
var _ = require('lodash');

module.exports = EpisodeDownloader;

function EpisodeDownloader(
  settings,
  fileManager,
  downloadClient,
  torrentSearchClient,
  episodeFilter,
  torrentFilter,
  searchTermFormatter) {

    this.settings = settings;
    this.fileManager = fileManager;
    this.downloadClient = downloadClient;
    this.torrentSearchClient = torrentSearchClient;
    this.episodeFilter = episodeFilter;
    this.torrentFilter = torrentFilter;
    this.searchTermFormatter = searchTermFormatter;
  }

  EpisodeDownloader.prototype.download = download;

  function download (episode) {
    var self = this;

    return self.episodeFilter.filter(episode)
    .then(function (includeEpisode) {
      if (!includeEpisode) {
        throw { 
          episode: episode, 
          reason: 'filtered out' 
        };
      }

      var term = this.searchTermFormatter.buildSearchTerm(episode);
      return self.torrentSearchClient.search(term);
    })
    .then(function (torrents) {

      var filteredTorrents = _.filter(torrents, self.torrentFilter.filter.bind(self.torrentFilter));

      if (!filteredTorrents.length) {
        throw { 
          episode: episode, 
          reason: 'not found' 
        };
      }

      var downloadDir = self.fileManager.join(settings.tv.downloadDirectory, episode.show);

      return self.downloader.addUrl(filteredTorrents[0].torrentLink, downloadDir);
    });
  }
