var _ = require('lodash'),
moment = require('moment');

module.exports = KickassTorrentSearch;

function KickassTorrentSearch(kickassClient) {
  this.kickassClient = kickassClient;
}

KickassTorrentSearch.prototype.search = search;

KickassTorrentSearch.prototype.mapResults = mapResults;

function search(term) {
  return this.kickassClient.search(term)
    .then(function (data) { 
      return this.mapResults(data);
    });
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
    torrentLink: entry.torrentLink,
    size: entry.size
  };
}
