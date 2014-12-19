describe('Trakt client', function() {

  var TraktClient = require('../lib/tv/trakt');

  var API_KEY = '1c1079c847bbf1df4fcbf794d9324959';

  /* Integration test */
  xit('should get shows\' episodes from date for timespan given in days', function (done) {

    var client = new TraktClient(API_KEY);

    client.userCalendarShows('gregorl', new Date(2014, 11, 12), 1)
      .done(function (data) {

        expect(data).toBeDefined();
        expect(data).not.toBeNull();

        var day1data = data[0];
        var date = day1data.date;

        expect(date).toBe('2014-12-12');

        var episodes = day1data.episodes;
        expect(episodes.length).toBe(1);

        var episodeEvent = episodes[0];

        expect(episodeEvent.show.title).toBe('The Big Bang Theory');
        expect(episodeEvent.episode.season).toBe(8);
        expect(episodeEvent.episode.number).toBe(11);

        done();
      });

  }, 30000);

});
