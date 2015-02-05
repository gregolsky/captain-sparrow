module.exports = EpisodeQueries;

var q = require('q'),
_ = require('lodash');

var tvRageMapper = include('tvrage/mapper');

function EpisodeQueries(tvRage, dateService) {
    this.tvRage = tvRage;
    this.dateService = dateService;
}

EpisodeQueries.prototype.getEpisodesByShowNameForTimeframe = getEpisodesByShowNameForTimeframe;
EpisodeQueries.prototype.getEpisodesByShowName = getEpisodesByShowName;
EpisodeQueries.prototype.getEpisodeListAndShowInfoById = getEpisodeListAndShowInfoById;
EpisodeQueries.prototype.searchShowByName = searchShowByName;

function getEpisodesByShowNameForTimeframe (showName, startDate, endDate) {
    var self = this;
    return self.getEpisodesByShowName(showName)
    .then(function (episodes) {
        return _.filter(episodes, function (e) {
            return e.airtime >= startDate && e.airtime <= endDate;
        });
    });
}

function getEpisodesByShowName(showName) {
    var self = this;
    return self.searchShowByName(showName)
    .then(function (searchShowResponse) {
        return self.getEpisodeListAndShowInfoById(searchShowResponse.showid);
    })
    .then(function (result) {
        return tvRageMapper.mapEpisodes(result.showInfo, result.episodeList);
    });
}

function getEpisodeListAndShowInfoById(showid) {
    var self = this;
    return q.all([ self.tvRage.showInfo(showid), self.tvRage.episodeList(showid) ])
    .spread(function (showInfoResponse, episodeListResponse) {
        return {
            showInfo: showInfoResponse.Showinfo,
            episodeList: episodeListResponse.Show.Episodelist[0].Season
        };
    });
}

function searchShowByName(showName) {
    var self = this;
    return self.tvRage.search(showName)
    .then(function (response) {
        if (response.Results == 0) {
            throw new Error('Show ' + showName + ' was not found in TvRage.');
        }

        return response.Results.show[0];
    });
}

