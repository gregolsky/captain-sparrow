
module.exports = Downloader;

function EpisodeDownloader(
  settings,
  fileManager,
  downloadClient,
  torrentSearchClient,
  episodeFilter,
  torrentFilter) {

    this.settings = settings;
    this.fileManager = fileManager;
    this.downloadClient = downloadClient;
    this.torrentSearchClient = torrentSearchClient;
    this.episodeFilter = episodeFilter;
    this.torrentFilter = torrentFilter;
  }

  EpisodeDownloader.prototype.download = download;

  function download (episode) {
    var self = this;

    return self.episodeFilter.filter(episode)
    .then(function (isFilteredOut) {
      if (isFilteredOut) {
        throw { 
          episode: episode, 
          reason: 'filtered out' 
        };
      }

      return self.torrentSearchClient.search(episode);
    })
    .then(function (torrents) {

      var filteredTorrents = _.filter(torrents, self.torrentFilter.filter.bind(self.torrentFilter));

      if (!filteredTorrents.length) {
        throw { 
          episode: episode, 
          reason: 'not found' 
        };
      }

      var downloadDir = self.fileManager.join(settings.downloadDirectory, episode.show);

      return self.downloader.addUrl(filteredTorrents[0].torrentLink, downloadDir);
    });

    // TODO filter torrents
  }
