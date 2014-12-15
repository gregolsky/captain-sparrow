describe('Episodes filter', function () {

  var EpisodesFilter = require('../lib/download/episodesFilter');
  var q = require('q');
  var moment = require('moment');

  it('filters out episode, when library contains', function (done) {

    var filter = new EpisodesFilter(
      null,
      null, 
      {
        contains: function () { 
          return q.when(true); 
        }
      }, 
      null);

      var episodeData = {};

      filter.filter(episodeData)
      .then(function (result) {
        expect(result).toBe(false);
        done();
      })
      .done();

  });

  it('filters out episode, when download queue contains', function (done) {
    var filter = new EpisodesFilter(
      null,
      {
        contains: function () { 
          return q.when(true); 
        }
      }, 
      {
        contains: function () { 
          return q.when(false); 
        }
      }, 
      null);

      var episodeData = {};

      filter.filter(episodeData)
      .then(function (result) {
        expect(result).toBe(false);
        done();
      })
      .done();
  });

  it('filters out episode, when it is surely too early to download', function (done) {
    var date = new Date();
    var filter = new EpisodesFilter(
      { hoursAfterAirTime: 1 } ,
      {
        contains: function () { 
          return q.when(false); 
        }
      }, 
      {
        contains: function () { 
          return q.when(false); 
        }
      }, 
      {
        currentDate: function () { return date; }
      });

      var episodeData = { airtime: date };

      filter.filter(episodeData)
      .then(function (result) {
        expect(result).toBe(false);
        done();
      })
      .done();

  });

  it('does not filter episode out, when all is ok', function (done) {
    var date = new Date();
    var filter = new EpisodesFilter(
      { hoursAfterAirTime: 1 } ,
      {
        contains: function () { 
          return q.when(false); 
        }
      }, 
      {
        contains: function () { 
          return q.when(false); 
        }
      }, 
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
    var filter = new EpisodesFilter(
      null,
      null, 
      {
        contains: function () { 
          throw new Error('Surprise!');
        }
      }, 
      null);

      var episodeData = {};

      try {
        filter.filter(episodeData)
          .done();
      } catch (error) {
        expect(error.message).toBe('Surprise!');
        done();
      }
  });
});
