'use strict';

const path = require('path');
const chalk = require('chalk');

class EpisodeDownloader {

    constructor(
        settings,
        downloadClient,
        torrentSearchClient,
        episodeFilter,
        torrentFilter,
        searchTermFormatter) {
        this.settings = settings;
        this.downloadClient = downloadClient;
        this.torrentSearchClient = torrentSearchClient;
        this.episodeFilter = episodeFilter;
        this.torrentFilter = torrentFilter;
        this.searchTermFormatter = searchTermFormatter;
    }

    async download(episode) {
        if (!episode) {
            throw new Error('Episode instance argument is mandatory.');
        }
        const includeEpisode = await this.episodeFilter.filter(episode);
        if (!includeEpisode.value) {
            throw new Error(chalk.magenta.bold(episode.describe()) + ' is filtered out: ' + includeEpisode.reason + '.');
        }

        let term = this.searchTermFormatter.formatSearchTerm(episode);
        const torrents = await this.torrentSearchClient.search(term);
        let filteredTorrents = torrents.filter(torrent => this.torrentFilter.filter(torrent));

        if (!filteredTorrents.length) {
            throw new Error(chalk.magenta.bold(episode.describe()) + ' was not found.');
        }

        let downloadDir = path.join(this.settings.tv.libraryPath, episode.show);

        return this.downloadClient.addUrl(filteredTorrents[0].torrentLink, downloadDir);
    }
}

module.exports = EpisodeDownloader;
