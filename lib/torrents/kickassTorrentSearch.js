var _ = require('lodash'),
moment = require('moment'),
searchTermFormatter = require('./searchTerm');

module.exports = KickassTorrentSearch;

function KickassTorrentSearch(settings, kickassClient) {
  this.kickassClient = kickassClient;
  this.settings = settings;
}

KickassTorrentSearch.prototype.search = search;

KickassTorrentSearch.prototype.preprocessTerm = preprocessTerm;

KickassTorrentSearch.prototype.mapResults = mapResults;

function search(term) {
  var term = searchTermFormatter.buildSearchTerm(episode);
  var preprocessedTerm = this.preprocessTerm(term);
  return this.kickassClient.search(preprocessTerm)
    .then(function (data) { 
      return this.mapResults(data);
    });
}

function preprocessTerm(term) {
  return term + this.settings.torrentSearchSuffix;
}

function mapResults(data) {
  return _(data.list)
    .map(mapEntry)
    .value();
}

function mapEntry(entry) {
  return {
    name: entry.title,
    seeds: entry.seeds,
    leechs: entry.leechs,
    createdAt: moment(entry.pubDate).toDate(),
    link: entry.torrentLink,
    size: entry.size
  };
}
