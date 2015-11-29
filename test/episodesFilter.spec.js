describe('Episode filter', function () {

    var EpisodeFilter = include('tv/episodeFilter');

    var q = require('q');
    var moment = require('moment');

    var createSettings = function (hoursAfterAirTime) {
        return { tv: { hoursAfterAirTime: hoursAfterAirTime } };
    };

    var createFakeWithContains = function (result, sync) {
        if (sync) {
            return {
                contains: function () { return result; }
            };
        }

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
            currentDate: function () { return date; },
            currentDateTime: function () { return date; }
        };
    });

    it('filters out episode, when library contains', function (done) {

        var filter = new EpisodeFilter(createSettings(0), createFakeWithContains(false), createFakeWithContains(true, true), fakeDateService);

        filter.filter(episodeData)
        .then(function (result) {
            result.value.should.be.false();
            result.reason.should.equal('library contains');
            done();
        })
        .done();

    });

    it('filters out episode, when download queue contains', function (done) {
        var filter = new EpisodeFilter(createSettings(0), createFakeWithContains(true), createFakeWithContains(false, true), fakeDateService);

        filter.filter(episodeData)
        .then(function (result) {
            result.value.should.be.false();
            result.reason.should.equal('already queued');
            done();
        })
        .done();
    });

    it('filters out episode, when it is surely too early to download', function (done) {
        var filter = new EpisodeFilter(createSettings(1), createFakeWithContains(false), createFakeWithContains(false, true), fakeDateService);

        filter.filter(episodeData)
        .then(function (result) {
            result.value.should.be.false();
            done();
        });
    });

    it('does not filter episode out, when all is ok', function (done) {
        var dateService = {
            currentDateTime: function () { return moment(date).add(1, 'h').toDate(); }
        };

        var filter = new EpisodeFilter(createSettings(1), createFakeWithContains(false), createFakeWithContains(false, true), dateService);

        var episodeData = { airtime: date };

        filter.filter(episodeData)
        .then(function (result) {
            result.value.should.be.true();
            should.not.exist(result.reason);
            done();
        })
        .done();

    });

    it('throws errors, when something goes wrong inside filtering methods', function (done) {
        var fakeWithContains = {
            contains: function () {
                var deferred = q.defer();

                setTimeout(function () {
                    deferred.reject(new Error('Surprise!'));
                }, 10);

                return deferred.promise;
            }
        };
        var filter = new EpisodeFilter(createSettings(0), fakeWithContains, createFakeWithContains(false, true), fakeDateService);

        var episodeData = {};

        filter.filter(episodeData)
        .then(function (result) {
            result.value.should.be.true();
            should.not.exist(result.reason);
            done();
        }, function (error) {
            error.message.should.equal('Surprise!');
            done();
        });

    });
});
