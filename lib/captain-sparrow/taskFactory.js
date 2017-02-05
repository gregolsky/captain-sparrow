'use strict';

import TorrentSearch from 'captain-sparrow/tasks/torrentSearch';
import TvShowsDownload from 'captain-sparrow/tasks/tvShowsDownload';
import CalendarFeed from 'captain-sparrow/tasks/calendarFeed';

import SearchTermFormatter from 'captain-sparrow/tv/searchTerm';
import EpisodeDownloader from 'captain-sparrow/tv/episodeDownloader';
import EpisodeFilter from 'captain-sparrow/tv/episodeFilter';
import EpisodesProvider from 'captain-sparrow/tv/episodesProvider';
import FutureEpisodesProvider from 'captain-sparrow/calendar/episodesProvider';

import TransmissionClient from 'captain-sparrow/transmission';
import TvLibrary from 'captain-sparrow/library';
import Cache from 'captain-sparrow/cache';
import Notifications from 'captain-sparrow/notifications';

import LimeTorrents from 'captain-sparrow/torrentProvider/limeTorrents';
import TorrentApiOrg from 'captain-sparrow/torrentProvider/torrentApiOrg';
import FileDownloader from 'captain-sparrow/search/fileDownloader';
import SubtitlesDownloader from 'captain-sparrow/subs/downloader';

import TvMaze from 'captain-sparrow/tvmaze/client';
import EpisodeQueries from 'captain-sparrow/tvmaze/episodeQueries';

import EpisodesExporter from 'captain-sparrow/calendar/episodesExporter';

import * as dateService from 'captain-sparrow/dateService';

const TORRENT_PROVIDER_NAME = 'torrent_api_org';

function getTorrentProvider () {
    let name = TORRENT_PROVIDER_NAME;
    if (!name || name === 'torrent_api_org') {
        return new TorrentApiOrg();
    } else if (name === 'limetorrents') {
        return new LimeTorrents();
    }
}

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
    let library = new TvLibrary(settings);
    let downloader = new SubtitlesDownloader(settings, library, new Notifications(settings));
    return library.initialize()
    .then(() => ({
        execute () {
            return downloader.downloadMissingSubtitles();
        }
    }));
}

function resolveTvShowsDownload (settings) {
    let tvmaze = new TvMaze();
    let cache = new Cache(dateService);
    let library = new TvLibrary(settings);

    return Promise.all([
        cache.attach(tvmaze, settings.tvmaze.cache),
        library.initialize()
    ])
    .then(function () {
        let episodeQueries = new EpisodeQueries(cache, dateService);
        let episodesProvider = new EpisodesProvider(settings.shows, settings.tv.episodesSince, episodeQueries, dateService);

        let transmissionClient = new TransmissionClient(settings.transmission);
        let torrentSearch = getTorrentProvider();

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
    });

}

function resolveTorrentSearch (settings) {
    let torrentSearch = getTorrentProvider();
    let fileDownloader = new FileDownloader();
    return Promise.resolve(new TorrentSearch(settings, torrentSearch, fileDownloader));
}

function resolveCalendarFeed (settings) {
    let tvmaze = new TvMaze();
    let cache = new Cache(dateService);
    return cache.attach(tvmaze, settings.tvmaze.cache)
    .then(function () {
        let episodeQueries = new EpisodeQueries(cache, dateService);
        let episodesProvider = new FutureEpisodesProvider(settings.shows, episodeQueries, dateService);
        let episodesExporter = new EpisodesExporter(settings.calendar.file);

        let task = new CalendarFeed(episodesProvider, episodesExporter);
        task.onTaskEnd(function () {
            return cache.save();
        });

        return task;
    });

}
