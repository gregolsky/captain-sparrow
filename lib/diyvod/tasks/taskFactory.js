
var 
    TransmissionClient = require('../transmission'),
    KickassTorrents = require('../torrents/kickass'),
    KickassTorrentSearch = require('../torrents/kickassTorrentSearch'),
    TvShowsDownload = require('./tvShowsDownload'),
    EpisodeFilter = require('./tv/episodeFilter'),
    EpisodesProvider = require('./tv/traktEpisodesProvider'),
    TraktClient = require('./tv/trakt'),
    TvLibrary = require('./tv/library'),
    EpisodeDownloader = require('./tv/episodeDownloader'),
    SearchTermFormatter = require('./tv/searchTerm');

function resolve(taskName, settings) {
  if (taskName == 'tv') {
    return resolveTvShowsDownload(settings);
  }

  throw new Error('Not supported task - ' + taskName + '.');
}

function resolveTvShowsDownload(settings) {
  var fileManager = require('../fileManager'),
      dateService = require('../dateService');
  
  var traktClient = new TraktClient(settings.trakt.apiKey);
  var episodesProvider = new EpisodesProvider(settings, dateService, traktClient);
  
  var transmissionClient = new TransmissionClient(settings.transmission);
  var kickassTorrents = new KickassTorrents();
  var torrentSearch = new KickassTorrentSearch(kickassTorrents);
  var library = new TvLibrary(settings, fileManager);

  var episodeFilter = new EpisodeFilter(settings, transmissionClient, library, dateService);
  var searchTermFormatter = new SearchTermFormatter(settings);

  var episodeDownloader = new EpisodeDownloader(
    settings,
    fileManager,
    transmissionClient,
    torrentSearch,
    episodeFilter,
    { filter: function (a) { return true; } }, // TODO torrent filter
    searchTermFormatter);

  return new TvShowsDownload(settings, episodesProvider, episodeDownloader);
}

module.exports = {
  resolve: resolve 
};
