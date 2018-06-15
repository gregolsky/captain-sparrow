'use strict';

const getEditDistance = require('jaro-winkler');
const { mapEpisodes } = require('./mapper');

class TvMazeEpisodeQueries {

    constructor(tvmaze, dateService) {
        this.tvmaze = tvmaze;
        this.dateService = dateService;
    }

    getEpisodesByShowNameForTimeframe(showName, startDate, endDate) {
        return this.getEpisodesByShowName(showName)
            .then((episodes) => {
                return episodes
                    .filter((e) =>
                        e.airtime >= startDate &&
                    e.airtime <= endDate);
            });
    }

    getEpisodesByShowName(showName) {
        return this.searchShowByName(showName)
            .then((searchShowResponse) => this.getEpisodeListAndShowInfoById(searchShowResponse.id))
            .then((result) => mapEpisodes(result.showInfo, result.episodeList));
    }

    getEpisodeListAndShowInfoById(showid) {
        return Promise.all([
            this.tvmaze.showInfo(showid),
            this.tvmaze.episodeList(showid)
        ])
            .then(([ showInfo, episodeList ]) => {
                return {
                    showInfo,
                    episodeList
                };
            });
    }

    searchShowByName(showName) {
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
                    } else if (distA === distB) {
                        return 0;
                    } else {
                        return -1;
                    }
                });

                return shows[0];
            });
    }
}

module.exports = TvMazeEpisodeQueries;
