'use strict';

import TorrentSearch from 'captain-sparrow/tasks/torrentSearch';
import TvShowsDownload from 'captain-sparrow/tasks/tvShowsDownload';
import CalendarFeed from 'captain-sparrow/tasks/calendarFeed';

import SearchTermFormatter from 'captain-sparrow/tv/searchTerm';
import EpisodeDownloader from 'captain-sparrow/tv/episodeDownloader';
import EpisodeFilter from 'captain-sparrow/tv/episodeFilter';
import EpisodesProvider from 'captain-sparrow/tv/episodesProvider';

import TransmissionClient from 'captain-sparrow/transmission';
import TvLibrary from 'captain-sparrow/library';
import Cache from 'captain-sparrow/cache';
import Notifications from 'captain-sparrow/notifications';

import TorrentApiOrg from 'captain-sparrow/torrentProvider/torrentApiOrg';
import FileDownloader from 'captain-sparrow/search/fileDownloader';
import SubtitlesDownloader from 'captain-sparrow/subs/downloader';

import TvMaze from 'captain-sparrow/tvmaze/client';
import EpisodeQueries from 'captain-sparrow/tvmaze/episodeQueries';

import EpisodesExporter from 'captain-sparrow/calendar/episodesExporter';

import * as dateService from 'captain-sparrow/dateService';

export function resolve (taskName, settings) {
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

function resolveSubsDownload (settings) {
    var library = new TvLibrary(settings);
    var downloader = new SubtitlesDownloader(settings, library, new Notifications(settings));
    return library.initialize()
    .then(() => ({
            execute() {
                return downloader.downloadMissingSubtitles();
            }
        }));
}

function resolveTvShowsDownload (settings) {
    var tvmaze = new TvMaze();
    debugger;
    var cache = new Cache(dateService);
    var library = new TvLibrary(settings);

    return Promise.all([
        cache.attach(tvmaze, settings.tvmaze.cache),
        library.initialize()
    ])
    .then(function () {
        var episodeQueries = new EpisodeQueries(cache, dateService);
        var episodesProvider = new EpisodesProvider(settings.shows, settings.tv.episodesSince, episodeQueries, dateService);

        var transmissionClient = new TransmissionClient(settings.transmission);
        var torrentSearch = new TorrentApiOrg();

        var episodeFilter = new EpisodeFilter(settings, transmissionClient, library, dateService);
        var searchTermFormatter = new SearchTermFormatter(settings);

        var episodeDownloader = new EpisodeDownloader(
            settings,
            transmissionClient,
            torrentSearch,
            episodeFilter, {
                filter: (a) => true
            }, // TODO torrent filter
            searchTermFormatter);

        var task = new TvShowsDownload(settings, episodesProvider, episodeDownloader);
        task.onTaskEnd(() => cache.save());

        return task;
    });

}

function resolveTorrentSearch (settings) {
    var torrentSearch = new TorrentApiOrg();
    var fileDownloader = new FileDownloader();
    return Promise.resolve(new TorrentSearch(settings, torrentSearch, fileDownloader));
}

function resolveCalendarFeed (settings) {
    var tvmaze = new TvMaze();
    var cache = new Cache(dateService);
    return cache.attach(tvmaze, settings.tvmaze.cache)
    .then(function () {
        var episodeQueries = new EpisodeQueries(cache, dateService);
        var episodesProvider = new EpisodesProvider(settings.shows, episodeQueries, dateService);
        var episodesExporter = new EpisodesExporter(settings.calendar.file);

        var task = new CalendarFeed(episodesProvider, episodesExporter);
        task.onTaskEnd(function () {
            return cache.save();
        });

        return task;
    });

}
