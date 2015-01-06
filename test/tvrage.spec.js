describe('TvRage client', function () {

  var TvRage = require('../lib/diyvod/tvrage/client');

  var KEY = 'test';
  var SHOW = 'The Walking Dead';
  var SHOW_ENCODED = 'The%20Walking%20Dead';

  it ('builds request url', function () {

    var client = new TvRage(KEY);

    var url = client.buildRequestUrl('search', { show: SHOW });
    expect(url).toBe('http://services.tvrage.com/myfeeds/search.php?key=' + KEY + '&show=' + SHOW_ENCODED);
  });

  xit('searches for shows', function (done) {

    var client = new TvRage('CUT');
    
    client.search('Walking')
      .then(function (data) {
        var show = data.Results.show[0];
        expect(show.name[0]).toBe('The Walking Dead');
        expect(show.showid[0]).toBe('25056');
        done();
      }, function (reason) {
        done(reason);
      })
      .catch(function (reason) {
        done(reason);
      });
  }, 30000);

});
