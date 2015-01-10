
var 
TransmissionClient = require('./transmission'),
TorrentSearch = require('./tasks/torrentSearch'),
KickassTorrents = require('./torrentProvider/kickass'),
KickassTorrentProvider = require('./torrentProvider/kickassTorrentProvider'),
q = require('q');

module.exports = {
  resolve: resolve 
};

function resolve(taskName, settings, fileManager, logger) {
  if (taskName == 'tv') {
    return resolveTvShowsDownload(settings, fileManager, logger);
  }

  if (taskName == 'search') {
    return resolveTorrentSearch(settings, fileManager, logger);
  }

  if (taskName == 'calendar') {
    return resolveCalendarFeed(settings, fileManager, logger);
  }

  throw new Error('Not supported task - ' + taskName + '.');
}

function resolveTvShowsDownload(settings, fileManager, logger) {
  var SearchTermFormatter = require('./tv/searchTerm'),
  EpisodeDownloader = require('./tv/episodeDownloader'),
  TvShowsDownload = require('./tasks/tvShowsDownload'),
  EpisodeFilter = require('./tv/episodeFilter'),
  TvLibrary = require('./tv/library'),
  TvRage = require('./tvrage/client'),
  Cache = require('./cache'),
  EpisodeQueries = require('./tvrage/episodeQueries'),
  EpisodesProvider = require('./tv/episodesProvider');

  var dateService = require('./dateService');

  var tvRage = new TvRage(settings.tvrage.apiKey);
  var cache = new Cache(fileManager, dateService, logger);
  var library = new TvLibrary(settings, fileManager);

  return q.all([cache.attach(tvRage, settings.tvrage.cache), library.initialize()])
  .then(function () {
    var episodeQueries = new EpisodeQueries(cache, dateService);
    var episodesProvider = new EpisodesProvider(settings.tvrage.shows, settings.tv.episodesSince, episodeQueries, dateService, logger);

    var transmissionClient = new TransmissionClient(settings.transmission);
    var kickassTorrents = new KickassTorrents();
    var torrentSearch = new KickassTorrentProvider(kickassTorrents);

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

      var task = new TvShowsDownload(settings, episodesProvider, episodeDownloader, logger);
      task.onTaskEnd(function () {
        return cache.save();
      });

      return task;
  });

}

function resolveTorrentSearch(settings, fileManager, logger) {

  var FileDownloader = require('./search/fileDownloader');
  var kickassTorrents = new KickassTorrents();
  var kickassTorrentSearch = new KickassTorrentProvider(kickassTorrents);

  var fileDownloader = new FileDownloader(fileManager);

  return q.when(new TorrentSearch(settings, kickassTorrentSearch, fileDownloader));
}

function resolveCalendarFeed(settings, fileManager, logger) {

  var EpisodesProvider = require('./calendar/episodesProvider'),
      EpisodesExporter = require('./calendar/episodesExporter'),
      TvRage = require('./tvrage/client'),
      CalendarFeed = require('./tasks/calendarFeed');

  var dateService = require('./dateService');
    
  var tvRage = new TvRage(settings.tvrage.apiKey);
  var cache = new Cache(fileManager, dateService, logger);
  return cache.attach(tvRage, settings.tvrage.cache)
    .then(function () {
      var episodeQueries = new EpisodeQueries(cache, dateService);
      var episodesProvider = new EpisodesProvider(settings.tvrage.shows, episodeQueries, dateService, logger);
      var episodesExporter = new EpisodesExporter(settings.calendar.file);

      var task = new CalendarFeed(episodesProvider, episodesExporter); 
      task.onTaskEnd(function () {
        return cache.save();
      });

      return task;
    });

}
