module.exports = Episode;  

var normalization = require('../normalize');

function Episode(show, number, season, title, airtime, runtime) {
  this.show = show;
  this.number = number;
  this.season = season;
  this.title = title;
  this.airtime = airtime;
  this.runtime = runtime;
}

Episode.prototype.isMatch = function (name) {
  var normalized = normalization.normalizeName(name);
  var showName = normalization.normalizeName(this.show);

  return normalized.indexOf(showName) != -1 &&
    normalized.indexOf(this.getEpisodeNumber()) != -1;
}

Episode.prototype.getEpisodeNumber = function () {
  return normalize.padLeft('S00', this.season) +
    normalize.padLeft('E00', this.number);
}
