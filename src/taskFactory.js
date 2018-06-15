'use strict';

const TorrentSearch = require('./tasks/torrentSearch');
const TvShowsDownload = require('./tasks/tvShowsDownload');
const CalendarFeed = require('./tasks/calendarFeed');

const SearchTermFormatter = require('./tv/searchTerm');
const EpisodeDownloader = require('./tv/episodeDownloader');
const EpisodeFilter = require('./tv/episodeFilter');
const EpisodesProvider = require('./tv/episodesProvider');
const FutureEpisodesProvider = require('./calendar/episodesProvider');

const TransmissionClient = require('./transmission');
const TvLibrary = require('./library');
const Cache = require('./cache');
const Notifications = require('./notifications');

const TorrentProvider = require('./torrentProvider');
const FileDownloader = require('./search/fileDownloader');
const SubtitlesDownloader = require('./subs/downloader');

const TvMaze = require('./tvmaze/client');
const EpisodeQueries = require('./tvmaze/episodeQueries');

const EpisodesExporter = require('./calendar/episodesExporter');

const dateService = require('./dateService');

function getTorrentProvider(settings) {
    return new TorrentProvider(settings);
}

module.exports = { resolve };

async function resolve(taskName, settings) {
    if (taskName === 'tv') {
        return resolveTvShowsDownload(settings);
    }

    if (taskName === 'search') {
        return resolveTorrentSearch(settings);
    }

    if (taskName === 'calendar') {
        return resolveCalendarFeed(settings);
    }

    if (taskName === 'subs') {
        return resolveSubsDownload(settings);
    }

    throw new Error('Not supported task - ' + taskName + '.');
}

async function resolveSubsDownload(settings) {
    let library = new TvLibrary(settings);
    let downloader = new SubtitlesDownloader(settings, library, new Notifications(settings));
    return library.initialize()
        .then(() => ({
            execute() {
                return downloader.downloadMissingSubtitles();
            }
        }));
}

async function resolveTvShowsDownload(settings) {
    let tvmaze = new TvMaze();
    let cache = new Cache(dateService);
    let library = new TvLibrary(settings);

    await Promise.all([
        cache.attach(tvmaze, settings.tvmaze.cache),
        library.initialize()
    ]);

    let episodeQueries = new EpisodeQueries(cache, dateService);
    let episodesProvider = new EpisodesProvider(settings.shows, settings.tv.episodesSince, episodeQueries, dateService);

    let transmissionClient = new TransmissionClient(settings.transmission);
    let torrentSearch = getTorrentProvider(settings);

    let episodeFilter = new EpisodeFilter(settings, transmissionClient, library, dateService);
    let searchTermFormatter = new SearchTermFormatter(settings);

    let episodeDownloader = new EpisodeDownloader(
        settings,
        transmissionClient,
        torrentSearch,
        episodeFilter, {
            filter: (a) => true
        }, // TODO torrent filter
        searchTermFormatter);

    let task = new TvShowsDownload(settings, episodesProvider, episodeDownloader);
    task.onTaskEnd(() => cache.save());

    return task;
}

async function resolveTorrentSearch(settings) {
    let torrentSearch = getTorrentProvider(settings);
    let fileDownloader = new FileDownloader();
    return Promise.resolve(new TorrentSearch(settings, torrentSearch, fileDownloader));
}

async function resolveCalendarFeed(settings) {
    let tvmaze = new TvMaze();
    let cache = new Cache(dateService);
    await cache.attach(tvmaze, settings.tvmaze.cache);
    let episodeQueries = new EpisodeQueries(cache, dateService);
    let episodesProvider = new FutureEpisodesProvider(settings.shows, episodeQueries, dateService);
    let episodesExporter = new EpisodesExporter(settings.calendar.file);

    let task = new CalendarFeed(episodesProvider, episodesExporter);
    task.onTaskEnd(function() {
        return cache.save();
    });

    return task;
}
