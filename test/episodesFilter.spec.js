describe('Episode filter', function () {

  var EpisodeFilter = require('../lib/diyvod/tv/episodeFilter');
  var q = require('q');
  var moment = require('moment');

  var createSettings = function (hoursAfterAirTime) {
    return { tv: { hoursAfterAirTime: hoursAfterAirTime } };
  };

  var createFakeWithContains = function (result) {
    return {
      contains: function () { 
        var deferred = q.defer();

        setTimeout(function () { 
          deferred.resolve(result);
        }, 10);

        return deferred.promise; 
      }
    };
  };


  var date;
  var episodeData;
  var fakeDateService;
  beforeEach(function () {
    date = new Date();
    episodeData = {
      airtime: date
    };

    fakeDateService = {
      currentDate: function () { return date; }
    };
  });


  it('filters out episode, when library contains', function (done) {

    var filter = new EpisodeFilter(
      createSettings(0),
      createFakeWithContains(false), 
      createFakeWithContains(true), 
      fakeDateService);

      filter.filter(episodeData)
      .then(function (result) {
        expect(result).toBe(false);
        done();
      })
      .done();

  });

  it('filters out episode, when download queue contains', function (done) {
    var filter = new EpisodeFilter(
      createSettings(0),
      createFakeWithContains(true), 
      createFakeWithContains(false), 
      fakeDateService);

      filter.filter(episodeData)
      .then(function (result) {
        expect(result).toBe(false);
        done();
      })
      .done();
  });

  it('filters out episode, when it is surely too early to download', function (done) {
    var filter = new EpisodeFilter(
      createSettings(1),
      createFakeWithContains(false), 
      createFakeWithContains(false), 
      fakeDateService);

      filter.filter(episodeData)
      .then(function (result) {
        expect(result).toBe(false);
        done();
      });
  });

  it('does not filter episode out, when all is ok', function (done) {
    var filter = new EpisodeFilter(
      createSettings(1),
      createFakeWithContains(false), 
      createFakeWithContains(false), 
      {
        currentDate: function () { return moment(date).add(1, 'h').toDate(); }
      });

      var episodeData = { airtime: date };

      filter.filter(episodeData)
      .then(function (result) {
        expect(result).toBe(true);
        done();
      })
      .done();

  });

  it('throws errors, when something goes wrong inside filtering methods', function (done) {
    var filter = new EpisodeFilter(
      createSettings(0),
      createFakeWithContains(false), 
      {
        contains: function () { 
          var deferred = q.defer();

          setTimeout(function () {
            deferred.reject(new Error('Surprise!'));
          }, 10);

          return deferred.promise;
        }
      }, 
      fakeDateService);

      var episodeData = {};

      filter.filter(episodeData)
      .catch(function (error) {
        expect(error.message).toBe('Surprise!');
        done();
      });

  });
});
