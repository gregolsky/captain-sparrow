const rewire = require('rewire');
const { FakeFilesystem } = require('./utils');

describe('Cache', function() {
    let Cache;
    let fakeFileSystem;
    let cachedService, simpleService, simpleServiceCacheSettings;
    let revertRewire;

    beforeEach(() => {
        Cache = rewire('../src/cache');
        const files = {
            'data/tvRageCache.txt': undefined
        };

        fakeFileSystem = new FakeFilesystem(files);

        revertRewire = Cache.__set__({
            'logger': global.getLoggerMock(),
            'fs': fakeFileSystem
        });
    });

    afterEach(() => {
        revertRewire();
    });

    beforeEach(function() {
        cachedService = new Cache(getDateService(new Date(2015, 0, 1)));

        simpleService = {
            operation() {
                return Promise.resolve(1);
            }
        };

        simpleServiceCacheSettings = {
            file: 'data/tvRageCache.txt',
            ttl: {
                operation: 2
            },
            operations: [ 'operation' ]
        };

    });

    it('proxies operations of existing services', async function() {
        should.not.exist(cachedService.cache);

        await cachedService.attach(simpleService, simpleServiceCacheSettings);
        should.exist(cachedService.cache);
        should.exist(cachedService.operation);

        const result = await cachedService.operation(1);
        result.should.equal(1);
    });

    it('caches results', async function() {
        await cachedService.attach(simpleService, simpleServiceCacheSettings)
        await cachedService.operation(1);
        const KEY = 'operation[1]';
        should.exist(cachedService.cache[KEY]);
        cachedService.cache[KEY].result.should.equal(1);
        cachedService.cache[KEY].expirationDate.should.equal('2015-01-03');
    });

    it('serializes to file', async function() {
        await cachedService.attach(simpleService, simpleServiceCacheSettings);
        await cachedService.operation(1);
        await cachedService.save();
        const cacheFileContent = fakeFileSystem.files[simpleServiceCacheSettings.file];
        cacheFileContent.should.equal('{"operation[1]":{"expirationDate":"2015-01-03","result":1}}');
    });

    function getDateService(now) {
        return {
            currentDate: function() {
                return now;
            }
        };
    }

});
