describe('torrentapi.org client', function () {

    var TorrentApiOrg = include('torrentProvider/torrentApiOrg');

    /* Integration test */
    it('finds some torrents, when asked for linux', function () {

        var torrentProject = new TorrentApiOrg();
        return torrentProject.search('test')
        .then(function (results) {
            should.exist(results);
            results.length.should.to.be.above(0);

            var entry = results[0];

            should.exist(entry);
            should.exist(entry.filename);
            should.exist(entry.download);
        });
    }, 10000);

});
