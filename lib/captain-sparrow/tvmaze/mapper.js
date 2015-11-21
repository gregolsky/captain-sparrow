module.exports = {
    mapEpisodes: mapEpisodes
};

var _ = require('lodash'),
moment = require('moment');

var normalize = include('normalize'),
Episode = include('tv/episode');

function mapEpisodes(showInfo, episodes) {
    var show = showInfo.name;

    return episodes
    .map((e) => {
        var number = e.number;
        var seasonNr = e.season;
        var title = e.name;
        var airtime = moment(e.airstamp).toDate();
        var runtime = e.runtime;
        return new Episode(show, number, seasonNr, title, airtime, runtime);
    });
}

function combineAirTime(showInfo, episode) {
    var tzinfo = showInfo.timezone[0].match(/GMT(\+|-)([0-9]+)/).slice(1);
    var tzString = tzinfo[0] + normalize.padLeft('00', tzinfo[1]) + ':00';
    var airtimeString = episode.airdate[0] + 'T' + showInfo.airtime[0] + tzString;
    var airtime = moment.parseZone(airtimeString).toDate();
    return airtime;
}
