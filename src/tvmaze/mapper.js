
const moment = require('moment');
const Episode = require('../tv/episode');

module.exports = { mapEpisodes };

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
