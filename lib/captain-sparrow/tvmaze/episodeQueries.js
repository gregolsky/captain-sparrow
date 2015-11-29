'use strict';

var q = require('q');

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
                .filter((e) => e.airtime >= startDate && e.airtime <= endDate);
        });
    }

    getEpisodesByShowName (showName) {
        return this.searchShowByName(showName)
        .then((searchShowResponse) => this.getEpisodeListAndShowInfoById(searchShowResponse.id))
        .then((result) => tvmazeMapper.mapEpisodes(result.showInfo, result.episodeList));
    }

    getEpisodeListAndShowInfoById (showid) {
        return q.all([ this.tvmaze.showInfo(showid), this.tvmaze.episodeList(showid) ])
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

            return response[0].show;
        });
    }
}
