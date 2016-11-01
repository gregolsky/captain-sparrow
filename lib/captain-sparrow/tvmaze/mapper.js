
import moment from 'moment';

import Episode from 'captain-sparrow/tv/episode';

export function mapEpisodes (showInfo, episodes) {
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
