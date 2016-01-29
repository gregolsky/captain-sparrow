var normalization = include('normalize');

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
        var normalized = normalization.normalizeName(name);
        var showName = normalization.normalizeName(this.show);

        return normalized.indexOf(showName) !== -1 &&
        normalized.indexOf(this.getEpisodeNumber()) !== -1;
    }

    getEpisodeNumber () {
        return normalization.padLeft('S00', this.season) +
        normalization.padLeft('E00', this.number);
    }

    describe () {
        return this.show + ' ' + this.getEpisodeNumber();
    }

    toString () {
        return '[Episode: ' + this.show + ' ' + this.getEpisodeNumber() + ']';
    }
}
