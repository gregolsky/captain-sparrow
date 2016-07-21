export default class TorrentProjectTorrentProvider {
    constructor (torrentProjectClient) {
        this.torrentProjectClient = torrentProjectClient;
    }

    search (term) {
        return this.torrentProjectClient.search(term)
        .then(data => this.mapResults(data));
    }

    mapResults (data) {
        return data.map(mapEntry);
    }

}

function mapEntry (entry) {
    return {
        name: entry.title,
        seeds: entry.seeds,
        leechs: entry.leechs,
        torrentLink: entry.torrent_link,
        size: entry.torrent_size
    };
}
