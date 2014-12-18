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
  console.log('normalized: ' + normalized);
  console.log('show: ' + showName);
  console.log(this.getEpisodeNumber());

  return normalized.indexOf(showName) != -1 &&
    normalized.indexOf(this.getEpisodeNumber()) != -1;
}

Episode.prototype.getEpisodeNumber = function () {
  return normalization.padLeft('S00', this.season) +
    normalization.padLeft('E00', this.number);
}
