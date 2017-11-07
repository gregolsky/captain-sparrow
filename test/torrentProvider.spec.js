const TorrentProvider = require('captain-sparrow/torrentProvider');

describe('Torrent provider', function () {

    /* Integration test */
    it('finds some torrents', function () {
        this.timeout(60000);
        
        var torrent = new TorrentProvider({
            searchServices: [ 'LimeTorrents', 'TorrentApiOrg' ]
        });
        return torrent.search('linux')
        .then(function (results) {
            should.exist(results);
            results.length.should.to.be.above(0);

            var entry = results[0];

            should.exist(entry);
            should.exist(entry.name);
            should.exist(entry.torrentLink);

            if (results[0].seeds) {
                (results[0].seeds >= results[1].seeds).should.be.true;
            }
        });
    }, 30000);

});
