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

Episode.prototype.isMatch = isMatch;
Episode.prototype.getEpisodeNumber = getEpisodeNumber;
Episode.prototype.describe = describe;
Episode.prototype.toString = toString;
  
function isMatch(name) {
  var normalized = normalization.normalizeName(name);
  var showName = normalization.normalizeName(this.show);

  return normalized.indexOf(showName) != -1 &&
    normalized.indexOf(this.getEpisodeNumber()) != -1;
}

function getEpisodeNumber() {
  return normalization.padLeft('S00', this.season) +
    normalization.padLeft('E00', this.number);
}

function describe() {
  return this.show + ' ' + this.getEpisodeNumber();
}

function toString() {
  return '[Episode: ' + this.show + ' ' + this.getEpisodeNumber() + ']';
}

