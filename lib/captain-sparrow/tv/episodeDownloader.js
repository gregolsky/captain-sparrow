module.exports = EpisodeDownloader;

var _ = require('lodash');

function EpisodeDownloader (
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
            if (!includeEpisode.value) {
                throw new Error(episode.describe().bold.magenta + ' is filtered out: ' + includeEpisode.reason + '.');
            }

            var term = self.searchTermFormatter.formatSearchTerm(episode);
            return self.torrentSearchClient.search(term);
        })
        .then(function (torrents) {

            var filteredTorrents = _.filter(torrents, self.torrentFilter.filter.bind(self.torrentFilter));

            if (!filteredTorrents.length) {
                throw new Error(episode.describe().bold.magenta + ' was not found.');
            }

            var downloadDir = self.fileManager.join(self.settings.tv.downloadDirectory, episode.show);

            return self.downloadClient.addUrl(filteredTorrents[0].torrentLink, downloadDir);
        });
}
