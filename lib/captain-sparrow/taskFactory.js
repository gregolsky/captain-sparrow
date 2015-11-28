module.exports = {
  resolve: resolve
};

var q = require('q');

var TransmissionClient = include('transmission'),
  TorrentSearch = include('tasks/torrentSearch'),
  KickassTorrents = include('torrentProvider/kickass'),
  KickassTorrentProvider = include('torrentProvider/kickassTorrentProvider');

function resolve (taskName, settings, fileManager, logger) {
  if (taskName === 'tv') {
    return resolveTvShowsDownload(settings, fileManager, logger);
  }

  if (taskName === 'search') {
    return resolveTorrentSearch(settings, fileManager, logger);
  }

  if (taskName === 'calendar') {
    return resolveCalendarFeed(settings, fileManager, logger);
  }

  if (taskName === 'subs') {
    return resolveSubsDownload(settings, fileManager, logger);
  }

  throw new Error('Not supported task - ' + taskName + '.');
}

function resolveSubsDownload (settings, fileManager, logger) {
  return null;
}

function resolveTvShowsDownload (settings, fileManager, logger) {
  var SearchTermFormatter = include('tv/searchTerm'),
    EpisodeDownloader = include('tv/episodeDownloader'),
    TvShowsDownload = include('tasks/tvShowsDownload'),
    EpisodeFilter = include('tv/episodeFilter'),
    TvLibrary = include('tv/library'),
    TvMaze = include('tvmaze/client'),
    Cache = include('cache'),
    EpisodeQueries = include('tvmaze/episodeQueries'),
    EpisodesProvider = include('tv/episodesProvider');

  var dateService = include('dateService');

  var tvmaze = new TvMaze();
  var cache = new Cache(fileManager, dateService, logger);
  var library = new TvLibrary(settings, fileManager);

  return q.all([cache.attach(tvmaze, settings.tvmaze.cache), library.initialize()])
  .then(function () {
    var episodeQueries = new EpisodeQueries(cache, dateService);
    var episodesProvider = new EpisodesProvider(settings.shows, settings.tv.episodesSince, episodeQueries, dateService, logger);

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

function resolveTorrentSearch (settings, fileManager, logger) {

  var FileDownloader = require('./search/fileDownloader');
  var kickassTorrents = new KickassTorrents();
  var kickassTorrentSearch = new KickassTorrentProvider(kickassTorrents);

  var fileDownloader = new FileDownloader(fileManager);

  return q.when(new TorrentSearch(settings, kickassTorrentSearch, fileDownloader));
}

function resolveCalendarFeed (settings, fileManager, logger) {

  var EpisodesProvider = include('calendar/episodesProvider'),
    EpisodesExporter = include('calendar/episodesExporter'),
    TvMaze = include('tvmaze/client'),
    Cache = include('cache'),
    EpisodeQueries = include('tvmaze/episodeQueries'),
    CalendarFeed = include('tasks/calendarFeed');

  var dateService = include('dateService');

  var tvmaze = new TvMaze();
  var cache = new Cache(fileManager, dateService, logger);
  return cache.attach(tvmaze, settings.tvmaze.cache)
    .then(function () {
      var episodeQueries = new EpisodeQueries(cache, dateService);
      var episodesProvider = new EpisodesProvider(settings.shows, episodeQueries, dateService, logger);
      var episodesExporter = new EpisodesExporter(settings.calendar.file);

      var task = new CalendarFeed(episodesProvider, episodesExporter);
      task.onTaskEnd(function () {
        return cache.save();
      });

      return task;
    });

}
