const stream = require('readable-stream');
const moment = require('moment');
const chalk = require('chalk');
const util = require('util');
const logger = require('../logger');

const streamFinished = util.promisify(stream.finished);

class TvShowsDownload {

    constructor(settings, episodesProvider, episodeDownloader) {
        this.settings = settings;
        this.episodesProvider = episodesProvider;
        this.episodeDownloader = episodeDownloader;
    }

    async execute() {
        this.printInfo();

        const episodesStream = this.episodesProvider.getEpisodes();

        let gotEpisodes = false;
        episodesStream.once('data', () => (gotEpisodes = true));

        episodesStream.on('data', (episode) => {
            this.episodeDownloader.download(episode)
                .then(() => logger.info(chalk.bold.magenta(episode.describe()) + ': OK'))
                .catch(err => logger.error(err && err.stack ? err.stack : err, episode));
        });

        episodesStream.on('error',
            err => logger.error(`Episodes provider stream error: ${ err.toString() }`));

        try {
            await streamFinished(episodesStream);
            if (!gotEpisodes) {
                logger.info('No episodes in the selected timespan');
            }
        } catch (err) {
            this.logger(`Error processing the episodes stream: ${ err.toString() }`);
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

    onTaskEnd(fun) {
        this.onEnd = fun;
    }
}

module.exports = TvShowsDownload;