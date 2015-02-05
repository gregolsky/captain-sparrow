module.exports = {
    mapEpisodes: mapEpisodes
};

var _ = require('lodash'),
moment = require('moment');

var normalize = include('normalize'),
Episode = include('tv/episode');

function mapEpisodes(showInfo, seasons) {
    var show = showInfo.showname[0];
    var runtime = parseInt(showInfo.runtime);

    var airtime = showInfo.airtime;
    var timezone = showInfo.timezone;

    return _(seasons)
    .map(function (season) {
        return _.map(season.episode, function (episode) {
            var number = parseInt(episode.seasonnum[0]);
            var seasonNr = parseInt(season.$.no);
            var title = episode.title[0];
            var airtime = combineAirTime(showInfo, episode);
            var runtime = parseInt(showInfo.runtime[0]);
            return new Episode(show, number, seasonNr, title, airtime, runtime);
        });
    })
    .flatten()
    .value();
}

function combineAirTime(showInfo, episode) {
    var tzinfo = showInfo.timezone[0].match(/GMT(\+|-)([0-9]+)/).slice(1);
    var tzString = tzinfo[0] + normalize.padLeft('00', tzinfo[1]) + ':00';
    var airtimeString = episode.airdate[0] + 'T' + showInfo.airtime[0] + tzString;
    var airtime = moment.parseZone(airtimeString).toDate();
    return airtime;
}
