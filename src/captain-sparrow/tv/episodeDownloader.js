'use strict';

import fs from 'captain-sparrow/fs';
import path from 'path';

export default class EpisodeDownloader {

    constructor (
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

    download (episode) {
        return this.episodeFilter.filter(episode)
            .then(includeEpisode => {
                if (!includeEpisode.value) {
                    throw new Error(episode.describe().bold.magenta + ' is filtered out: ' + includeEpisode.reason + '.');
                }

                let term = this.searchTermFormatter.formatSearchTerm(episode);
                return this.torrentSearchClient.search(term);
            })
            .then(torrents => {
                let filteredTorrents = torrents.filter(torrent => this.torrentFilter.filter(torrent));

                if (!filteredTorrents.length) {
                    throw new Error(episode.describe().bold.magenta + ' was not found.');
                }

                let downloadDir = path.join(this.settings.tv.libraryPath, episode.show);

                return this.downloadClient.addUrl(filteredTorrents[0].torrentLink, downloadDir);
            });
    }
}
