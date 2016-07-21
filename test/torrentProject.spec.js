describe('Torrent project client', function () {

    var TorrentProjectClient = include('torrentProvider/torrentProject');

    /* Integration test */
    it('finds some torrents, when asked for linux', function (done) {

        var torrentProject = new TorrentProjectClient();
        torrentProject.search('linux')
        .then(function (results) {
            should.exist(results);
            results.length.should.to.be.above(0);

            var entry = results[0];

            should.exist(entry);
            should.exist(entry.title);
            should.exist(entry.seeds);
            should.exist(entry.leechs);
            should.exist(entry.torrent_size);
            should.exist(entry.torrent_hash);
            should.exist(entry.torrent_link);
            done();
        })
        .catch(done);
    }, 10000);

});
