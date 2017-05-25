const LimeTorrents = require('captain-sparrow/torrentProvider/limeTorrents');

describe('LimeTorrents client', function () {

    /* Integration test */
    it('finds some torrents, when asked for linux', function () {
        this.timeout(10000);

        var torrent = new LimeTorrents();
        return torrent.search('linux')
        .then(function (results) {
            should.exist(results);
            results.length.should.to.be.above(0);

            var entry = results[0];

            should.exist(entry);
            should.exist(entry.name);
            should.exist(entry.torrentLink);

            (results[0].seeds >= results[1].seeds).should.be.true;
        });
    }, 10000);

});
