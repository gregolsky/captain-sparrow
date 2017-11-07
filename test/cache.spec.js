describe('Cache', function () {
    let Cache;
    let simpleCache, simpleService, simpleServiceCacheSettings;

    useMockery(beforeEach, afterEach, () => ({
        'fs': global.getFsMock({
            'root': {}
        }),
        'captain-sparrow/logger': global.getLoggerMock()
    }));

    beforeEach(() => {
        Cache = require('captain-sparrow/cache');
    });

    beforeEach(function () {
        simpleCache = new Cache(getDateService(new Date(2015, 0, 1)));

        simpleService = {
            operation () {
                return Promise.resolve(1);
            }
        };

        simpleServiceCacheSettings = {
            file: 'root/tvRageCache',
            ttl: {
                operation: 2
            },
            operations: [ 'operation' ]
        };

    });

    it('proxies operations of existing services', function () {

        should.not.exist(simpleCache.cache);

        return simpleCache.attach(simpleService, simpleServiceCacheSettings)
        .then(function () {
            should.exist(simpleCache.cache);
            should.exist(simpleCache.operation);

            return simpleCache.operation(1);
        })
        .then(function (result) {
            result.should.equal(1);
        });

    });

    it('caches results', function (done) {

        simpleCache.attach(simpleService, simpleServiceCacheSettings)
        .then(function () {
            return simpleCache.operation(1);
        })
        .then(function (result) {
            const KEY = 'operation[1]';
            should.exist(simpleCache.cache[KEY]);
            simpleCache.cache[KEY].result.should.equal(1);
            simpleCache.cache[KEY].expirationDate.should.equal('2015-01-03');

            done();
        })
        .catch(function (reason) {
            done(reason);
        });

    });

    it('serializes to file', function () {
        let fs = require('captain-sparrow/fs');
        return simpleCache.attach(simpleService, simpleServiceCacheSettings)
        .then(() => simpleCache.operation(1))
        .then(result => simpleCache.save())
        .then(() => fs.readFile(simpleServiceCacheSettings.file, 'utf8'))
        .then(cacheFileContent => {
            cacheFileContent.should.equal('{"operation[1]":{"expirationDate":"2015-01-03","result":1}}');
        });
    });

    function getDateService (now) {
        return {
            currentDate: function () {
                return now;
            }
        };
    }

});
