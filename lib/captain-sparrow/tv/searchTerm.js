module.exports = SearchTermFormatter;

var normalize = include('normalize');

function SearchTermFormatter (settings) {
  this.settings = settings;
}

SearchTermFormatter.prototype.formatSearchTerm = function (episode) {
  var showNormalized = normalize.normalizeName(episode.show);
  var term = showNormalized + ' ' + episode.getEpisodeNumber() + ' ' + this.settings.tv.searchSuffix;
  return term;
};
