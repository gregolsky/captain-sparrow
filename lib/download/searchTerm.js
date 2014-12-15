
  function buildSearchTermForEpisode(episode) {
      var showNormalized = episode.show.replace(/[^A-Za-z0-9 \.]/g, '');
      var term = showNormalized + ' '
        padLeft('S00', episode.season) +
        padLeft('E00', episode.number);
  }

  function padLeft(padString, arg) {
    return (padString + arg).slice(-padString.length);
  }

  module.exports = {
    buildSearchTerm: buildSearchTermForEpisode
  };
