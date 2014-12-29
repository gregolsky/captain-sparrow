
var 
    TransmissionClient = require('./transmission'),
    KickassTorrents = require('./torrentProvider/kickass'),
    KickassTorrentProvider = require('./torrentProvider/kickassTorrentProvider'),
    TvShowsDownload = require('./tasks/tvShowsDownload'),
    EpisodeFilter = require('./tv/episodeFilter'),
    EpisodesProvider = require('./tv/traktEpisodesProvider'),
    TraktClient = require('./tv/trakt'),
    TvLibrary = require('./tv/library'),
    EpisodeDownloader = require('./tv/episodeDownloader'),
    SearchTermFormatter = require('./tv/searchTerm');

function resolve(taskName, settings, fileManager, logger) {
  if (taskName == 'tv') {
    return resolveTvShowsDownload(settings, fileManager, logger);
  }

  throw new Error('Not supported task - ' + taskName + '.');
}

function resolveTvShowsDownload(settings, fileManager, logger) {
  var dateService = require('./dateService');
  
  var traktClient = new TraktClient(settings.trakt.apiKey, logger);
  var episodesProvider = new EpisodesProvider(settings, dateService, traktClient);
  
  var transmissionClient = new TransmissionClient(settings.transmission);
  var kickassTorrents = new KickassTorrents();
  var torrentSearch = new KickassTorrentProvider(kickassTorrents);
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

  return new TvShowsDownload(settings, episodesProvider, episodeDownloader, logger);
}

module.exports = {
  resolve: resolve 
};