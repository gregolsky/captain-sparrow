module.exports = Diyvod;

var TvShowsDownloadStrategy = require('./tvShowsDownloadStrategy'),
  DateService = require('./dateService'),
  Settings = require('./config.js'),
  TorrentSearch = require('./torrents/kickassTorrentSearch'),
  EpisodeFilter = require('./tv/episodesFilter'),
  EpisodesProvider = require('./tv/traktEpisodesProvider'),
  Library = require('./library/library'),
  FileManager = require('./fileManager'),
  EpisodeDownloader = require('./download/episodeDownloader'),
  TorrentClient = require('./download/transmission');

// TODO accept date and number of days as argument
// TODO logging
function Diyvod() {
  this.downloadStrategy = null;
}

Diyvod.prototype.initialize = function () {
  //TODO
}

Diyvod.prototype.run = function () {
  this.initialize();

  this.downloadStrategy.execute();
}
