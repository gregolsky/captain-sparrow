const moment = require('moment');
const chalk = require('chalk');
const logger = require('../logger');

class TvShowsDownload {

    constructor(settings, episodesProvider, episodeDownloader) {
        this.settings = settings;
        this.episodesProvider = episodesProvider;
        this.episodeDownloader = episodeDownloader;
    }

    async execute() {
        this.printInfo();

        try {
            const episodes = await this.episodesProvider.getEpisodes();

            if (!episodes.length) {
                logger.info('No episodes in the selected timespan');
                return;
            }

            const results = await this.downloadEpisodes(episodes);
            return this.describeResults(episodes, results);
        } finally {
            if (this.onEnd) {
                await this.onEnd();
            }
        }
    }

    printInfo() {
        logger.debug('Getting episodes');

        if (this.settings.tv && this.settings.tv.episodesSince) {
            logger.debug(`since ${ moment(this.settings.tv.episodesSince).format('YYYY-MM-DD') }`);
        }

        if (this.settings.shows && this.settings.shows.length) {
            logger.debug(`for show ${ this.settings.shows.join(', ') }`);
        }
    }

    downloadEpisodes(episodes) {
        var dlPromises = episodes.map(episode =>
            this.episodeDownloader.download(episode)
                .then(result => {
                    return { state: 'fulfilled' };
                })
                .catch(reason => {
                    return { state: 'rejected', reason };
                }));

        return Promise.all(dlPromises);
    }

    describeResults(episodes, results) {
        results.forEach((result, i) => {
            if (result.state === 'fulfilled') {
                logger.info(chalk.bold.magenta(episodes[i].describe()) + ': OK');
            } else {
                var { reason } = result;
                if (reason.stack) {
                    logger.error(reason.stack, episodes[i]);
                } else {
                    logger.error(reason);
                }
            }
        });
    }

    onTaskEnd(fun) {
        this.onEnd = fun;
    }
}

module.exports = TvShowsDownload;