module.exports = EpisodeFilter;

var q = require('q'),
moment = require('moment'),
_ = require('lodash');

function EpisodeFilter(
    settings,
    downloader,
    library,
    dateService) {

        if (settings.tv.hoursAfterAirTime === undefined ||
            settings.tv.hoursAfterAirTime === null) {
            throw new Error('Configuration error: missing hours after air time');
        }

        this.settings = settings;
        this.downloader = downloader;
        this.library = library;
        this.dateService = dateService;
    }

    EpisodeFilter.prototype.filter = function (episode) {

        if (!this.itIsTimeToDownload(episode)) {
            return q.when(filteredOut('too soon to download'));
        }

        if (!this.libraryDoesNotContainEpisode(episode)) {
            return q.when(filteredOut('library contains'));
        }

        return this.episodeIsNotBeingDownloaded(episode);
    }

    EpisodeFilter.prototype.itIsTimeToDownload = function (episode) {
        var downloadTime = moment(episode.airtime) //TODO fix moment usage
        .add(this.settings.tv.hoursAfterAirTime, 'h')
        .toDate() 

        return downloadTime <= this.dateService.currentDateTime();
    }

    EpisodeFilter.prototype.libraryDoesNotContainEpisode = function (episode) {
        return !this.library.contains(episode);
    }

    EpisodeFilter.prototype.episodeIsNotBeingDownloaded = function (episode) {
        return this.downloader.contains(episode)
        .then(function (downloadQueueContains) {
            var filtered = downloadQueueContains;
            if (filtered) {
                return filteredOut('already queued');
            }

            return { value: true };
        });
    }

    function filteredOut(reason) {
        return {
            reason: reason,
            value: false
        }
    }

