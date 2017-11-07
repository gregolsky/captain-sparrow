const TorrentApiOrg = require('captain-sparrow/torrentProvider/torrentApiOrg');

describe('torrentapi.org client', function () {

    /* Integration test */
    it('finds some torrents', function () {

        var torrentProject = new TorrentApiOrg();
        return torrentProject.search('test')
        .then(function (results) {
            should.exist(results);
            results.length.should.to.be.above(0);

            var entry = results[0];

            should.exist(entry);
            should.exist(entry.name);
            should.exist(entry.torrentLink);
        });
    }, 10000);

});
