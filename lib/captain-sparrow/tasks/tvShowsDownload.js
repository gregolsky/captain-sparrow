import moment from 'moment';
import chalk from 'chalk';

export default class TvShowsDownload {

    constructor (settings, episodesProvider, episodeDownloader, logger) {
        this.settings = settings;
        this.episodesProvider = episodesProvider;
        this.episodeDownloader = episodeDownloader;
        this.logger = logger;
    }

    execute () {
        this.printInfo();

        return this.episodesProvider.getEpisodes()
        .then((episodes) => {

            if (!episodes.length) {
                this.logger.info('No episodes in the selected timespan');
                return;
            }

            return this.downloadEpisodes(episodes)
            .then(results => this.describeResults(episodes, results));
        })
        .finally(() => {
            if (this.onEnd) {
                return this.onEnd();
            }
        });
    }

    printInfo () {
        this.logger.debug('Getting episodes');

        if (this.settings.tv && this.settings.tv.episodesSince) {
            this.logger.debug(`since ${ moment(this.settings.tv.episodesSince).format('YYYY-MM-DD') }`);
        }

        if (this.settings.shows && this.settings.shows.length) {
            this.logger.debug(`for show ${ this.settings.shows.join(', ') }`);
        }
    }

    downloadEpisodes (episodes) {
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

    describeResults (episodes, results) {
        results.forEach((result, i) => {
            if (result.state === 'fulfilled') {
                this.logger.info(chalk.bold.magenta(episodes[i].describe()) + ': OK');
            }
            else {
                var { reason } = result;
                if (reason.stack) {
                    this.logger.error(reason.stack, episodes[i]);
                }
                else {
                    this.logger.error(reason);
                }
            }
        });
    }

    onTaskEnd (fun) {
        this.onEnd = fun;
    }
}
