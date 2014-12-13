describe('Kickass torrents client', function () {

  var Kickass = require('../lib/torrents/kickass.js');

  it('finds some torrents, when asked for linux', function (done) {

    var kickass = new Kickass();
    kickass.search('linux')
    .done(function (results) {

      expect(results).toBeDefined();
      expect(results.list).toBeDefined();
      expect(results.list.length).toBeGreaterThan(0);

      var entry = results.list[0];

      expect(entry).toBeDefined();
      expect(entry.title).toBeDefined();
      expect(entry.seeds).toBeDefined();
      expect(entry.leechs).toBeDefined();
      expect(entry.size).toBeDefined();
      expect(entry.torrentLink).toBeDefined();

      done();
    });

  }, 10000);

});
