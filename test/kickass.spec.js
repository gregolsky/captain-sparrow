describe('Kickass torrents client', function () {

    var Kickass = include('torrentProvider/kickass');

  /* Integration test */
    xit('finds some torrents, when asked for linux', function (done) {

        var kickass = new Kickass();
        kickass.search('linux')
    .done(function (results) {

        should.exist(results);
        should.exist(results.list);
        results.list.length.should.to.be.above(0);

        var entry = results.list[0];

        should.exist(entry);
        should.exist(entry.title);
        should.exist(entry.seeds);
        should.exist(entry.leechs);
        should.exist(entry.size);
        should.exist(entry.torrentLink);

        done();
    });

    }, 10000);

});
