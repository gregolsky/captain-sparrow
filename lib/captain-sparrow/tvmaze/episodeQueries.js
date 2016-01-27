'use strict';

var q = require('q'),
getEditDistance = require('jaro-winkler');

var tvmazeMapper = include('tvmaze/mapper');

export default class TvMazeEpisodeQueries {

    constructor (tvmaze, dateService) {
        this.tvmaze = tvmaze;
        this.dateService = dateService;
    }

    getEpisodesByShowNameForTimeframe (showName, startDate, endDate) {
        return this.getEpisodesByShowName(showName)
        .then((episodes) => {
            return episodes
                .filter((e) =>
                    e.airtime >= startDate &&
                    e.airtime <= endDate);
        });
    }

    getEpisodesByShowName (showName) {
        return this.searchShowByName(showName)
        .then((searchShowResponse) => this.getEpisodeListAndShowInfoById(searchShowResponse.id))
        .then((result) => tvmazeMapper.mapEpisodes(result.showInfo, result.episodeList));
    }

    getEpisodeListAndShowInfoById (showid) {
        return q.all([
            this.tvmaze.showInfo(showid),
            this.tvmaze.episodeList(showid)
        ])
        .spread((showInfoResponse, episodeListResponse) => {
            return {
                showInfo: showInfoResponse,
                episodeList: episodeListResponse
            };
        });
    }

    searchShowByName (showName) {
        return this.tvmaze.search(showName)
        .then((response) => {
            if (!response || !response.length) {
                throw new Error(`Show ${ showName } was not found in TvMaze.`);
            }

            let shows = response.map(x => x.show);

            shows.sort((a, b) => {
                let distA = getEditDistance(showName, a.name);
                let distB = getEditDistance(showName, b.name);

                if (distA < distB) {
                    return 1;
                }
                else if (distA === distB) {
                    return 0;
                }
                else {
                    return -1;
                }
            });

            return shows[0];
        });
    }
}
