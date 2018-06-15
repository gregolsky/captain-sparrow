const EpisodeFilter = require('../src/tv/episodeFilter');
const moment = require('moment');

describe('Episode filter', function() {

    var createSettings = function(hoursAfterAirTime) {
        return { tv: { hoursAfterAirTime: hoursAfterAirTime } };
    };

    var createFakeWithContains = function({
        result
    }) {
        return {
            contains() {
                return Promise.resolve(result);
            }
        };
    };

    var date;
    var episodeData;
    var fakeDateService;

    beforeEach(function() {
        date = new Date();
        episodeData = {
            airtime: date
        };

        fakeDateService = {
            currentDate: function() {
                return date;
            },
            currentDateTime: function() {
                return date;
            }
        };
    });

    it('filters out episode, when library contains', function() {

        var filter = new EpisodeFilter(
            createSettings(0),
            createFakeWithContains({ result: false }),
            createFakeWithContains({ result: true }),
            fakeDateService);

        return filter.filter(episodeData)
            .then(function(result) {
                result.value.should.be.false();
                result.reason.should.equal('already in library');
            });
    });

    it('filters out episode, when download queue contains', function() {
        var filter = new EpisodeFilter(
            createSettings(0),
            createFakeWithContains({
                result: true
            }),
            createFakeWithContains({
                result: false
            }),
            fakeDateService);

        return filter.filter(episodeData)
            .then(function(result) {
                should.exist(result.value);
                should.exist(result.reason);
                result.value.should.be.false();
                result.reason.should.equal('already queued');
            });
    });

    it('filters out episode, when it is surely too early to download', function() {
        var filter = new EpisodeFilter(
            createSettings(1),
            createFakeWithContains({ result: false }),
            createFakeWithContains({ result: false }),
            fakeDateService);

        return filter.filter(episodeData)
            .then(function(result) {
                result.value.should.be.false();
            });
    });

    it('does not filter episode out, when all is ok', function() {
        var dateService = {
            currentDateTime: function() {
                return moment(date).add(1, 'h').toDate();
            }
        };

        var filter = new EpisodeFilter(
            createSettings(1),
            createFakeWithContains({ result: false }),
            createFakeWithContains({ result: false }),
            dateService);

        var episodeData = { airtime: date };

        return filter.filter(episodeData)
            .then(function(result) {
                result.value.should.be.true();
                should.not.exist(result.reason);
            });
    });

    it('throws errors, when something goes wrong inside filtering methods', function(done) {
        var fakeWithContains = {
            contains: function() {
                return Promise.reject(new Error('Surprise!'));
            }
        };
        var filter = new EpisodeFilter(createSettings(0), fakeWithContains, createFakeWithContains(false, true), fakeDateService);

        var episodeData = {};
        filter.filter(episodeData)
            .then(function(result) {
                result.value.should.be.true();
                should.not.exist(result.reason);
                done();
            }, function(error) {
                error.message.should.equal('Surprise!');
                done();
            });

    });
});
