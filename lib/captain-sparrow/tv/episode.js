import { normalizeName, padLeft } from 'captain-sparrow/normalize';

export default class Episode {

    constructor (show, number, season, title, airtime, runtime) {
        this.show = show;
        this.number = number;
        this.season = season;
        this.title = title;
        this.airtime = airtime;
        this.runtime = runtime;
    }

    isMatch (name) {
        var normalized = normalizeName(name);
        var showName = normalizeName(this.show);

        return normalized.indexOf(showName) !== -1 &&
        normalized.indexOf(this.getEpisodeNumber()) !== -1;
    }

    getEpisodeNumber () {
        return padLeft('S00', this.season) +
        padLeft('E00', this.number);
    }

    describe () {
        return this.show + ' ' + this.getEpisodeNumber();
    }

    toString () {
        return '[Episode: ' + this.show + ' ' + this.getEpisodeNumber() + ']';
    }
}
