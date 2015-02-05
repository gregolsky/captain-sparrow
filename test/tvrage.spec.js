describe('TvRage client', function () {

  var TvRage = include('tvrage/client');

  var KEY = 'test';
  var SHOW = 'The Walking Dead';
  var SHOW_ENCODED = 'The%20Walking%20Dead';

  it ('builds request url', function () {

    var client = new TvRage(KEY);

    var url = client.buildRequestUrl('search', { show: SHOW });
    url.should.equal('http://services.tvrage.com/myfeeds/search.php?key=' + KEY + '&show=' + SHOW_ENCODED);
  });

  xit('searches for shows', function (done) {

    var client = new TvRage('CUT');
    
    client.search('Walking')
      .then(function (data) {
        var show = data.Results.show[0];
        show.name[0].should.equal('The Walking Dead');
        show.showid[0].should.equal('25056');
        done();
      }, function (reason) {
        done(reason);
      })
      .catch(function (reason) {
        done(reason);
      });
  }, 30000);

});
