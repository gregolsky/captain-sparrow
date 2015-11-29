module.exports = TvShowsDownload;

var _ = require('lodash'),
q = require('q');

function TvShowsDownload (settings, episodesProvider, episodeDownloader, logger) {
    this.settings = settings;
    this.episodesProvider = episodesProvider;
    this.episodeDownloader = episodeDownloader;
    this.logger = logger;
}

TvShowsDownload.prototype.execute = execute;
TvShowsDownload.prototype.onTaskEnd = onTaskEnd;
TvShowsDownload.prototype.downloadEpisodes = downloadEpisodes;
TvShowsDownload.prototype.describeResults = describeResults;

function execute () {
    var self = this;

    self.logger.debug('Getting episodes');

    return self.episodesProvider.getEpisodes()
    .then(function (episodes) {

        if (!episodes.length) {
            self.logger.info('No episodes in the selected timespan');
            return;
        }

        return self.downloadEpisodes(episodes)
        .then(function (results) {
            self.describeResults(episodes, results);
        });
    })
    .finally(function () {
        if (self.onEnd) {
            return self.onEnd();
        }
    });
}

function downloadEpisodes (episodes) {
    var self = this;
    var downloadPromises = _.map(episodes, function (episode) {
        return self.episodeDownloader.download(episode);
    });

    return q.allSettled(downloadPromises);
}

function describeResults (episodes, results) {
    var self = this;

    results.forEach(function (result, i) {
        if (result.state === 'fulfilled') {
            self.logger.info(episodes[i].describe().bold.magenta + ': OK');
        }
        else {
            var reason = result.reason;
            if (reason.stack) {
                self.logger.error(reason.stack, episodes[i]);
            }
            else {
                self.logger.error(reason);
            }
        }
    });
}

function onTaskEnd (fun) {
    this.onEnd = fun;
}