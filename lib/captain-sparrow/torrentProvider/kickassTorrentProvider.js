module.exports = KickassTorrentProvider;

var _ = require('lodash');

function KickassTorrentProvider (kickassClient) {
    this.kickassClient = kickassClient;
}

KickassTorrentProvider.prototype.search = search;
KickassTorrentProvider.prototype.mapResults = mapResults;

function search (term) {
    var self = this;
    return this.kickassClient.search(term)
    .then(function (data) {
        return self.mapResults(data);
    });
}

function mapResults (data) {
    return _(data.list)
    .map(mapEntry)
    .value();
}

function mapEntry (entry) {
    return {
        name: entry.title,
        seeds: entry.seeds,
        leechs: entry.leechs,
        createdAt: new Date(entry.pubDate),
        torrentLink: entry.torrentLink,
        size: entry.size
    };
}
