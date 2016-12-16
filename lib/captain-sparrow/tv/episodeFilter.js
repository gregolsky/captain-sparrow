import moment from 'moment';

export default class EpisodeFilter {

    constructor (settings, downloader, library, dateService) {

        if (settings.tv.hoursAfterAirTime === undefined ||
            settings.tv.hoursAfterAirTime === null) {
            throw new Error('Configuration error: missing hours after air time');
        }

        this.settings = settings;
        this.downloader = downloader;
        this.library = library;
        this.dateService = dateService;
    }

    filter (episode) {

        let checks = [
            filterCheck(() => this.isItTimeToDownload(episode), 'too soon to download'),
            filterCheck(() => this.libraryDoesNotContainEpisode(episode), 'already in library'),
            filterCheck(() => this.episodeIsNotBeingDownloaded(episode), 'already queued')
        ];

        return Promise.all(checks)
        .then(() => ({ value: true }))
        .catch(reason => {
            if (reason instanceof Error) {
                throw reason;
            }

            return { value: false, reason };
        });
    }

    isItTimeToDownload (episode) {
        var downloadTime = moment(episode.airtime) // TODO fix moment usage
        .add(this.settings.tv.hoursAfterAirTime, 'h')
        .toDate();

        let result = downloadTime <= this.dateService.currentDateTime();
        return Promise.resolve(result);
    }

    libraryDoesNotContainEpisode (episode) {
        return Promise.resolve(this.library.contains(episode))
        .then(result => !result);
    }

    episodeIsNotBeingDownloaded (episode) {
        return this.downloader.contains(episode)
        .then(result => !result);
    }

}

function filterCheck(check, filterOutMsg) {
    return Promise.resolve(check())
    .then(result => (!result ? Promise.reject(filterOutMsg) : Promise.resolve()))
}

function filteredOut (reason) {
    return {
        reason: reason,
        value: false
    };
}
