describe('Cache', function () {

  var q = require('q');
  var Cache = require('../lib/diyvod/tv/tvrage/cache');

  var logger = jasmine.createSpyObj('logger', [ 'error', 'info' ]);

  var simpleCache, simpleService, simpleServiceCacheSettings;

  beforeEach(function () {
    var fileManager = getFileManager({});

    simpleCache = new Cache(fileManager, getDateService(new Date(2015, 0, 01)), logger);
    simpleService = {
      operation: function () {
        return q.when(1);
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

  it ('proxies operations of existing services', function (done) {

    expect(simpleCache.cache).toBe(null);

    simpleCache.attach(simpleService, simpleServiceCacheSettings)
    .then(function () {
      expect(simpleCache.cache).not.toBe(null);
      expect(simpleCache.operation).toBeDefined();

      return simpleCache.operation(1);
    })
    .then(function (result) {
      expect(result).toBe(1);
      done();
    })
    .catch(function (reason) {
      done(reason);
    });

  });

  it ('caches results', function (done) {

    simpleCache.attach(simpleService, simpleServiceCacheSettings)
    .then(function () {
      return simpleCache.operation(1);
    })
    .then(function (result) {
      expect(simpleCache.cache['operation{"0":1}']).toBeDefined();
      expect(simpleCache.cache['operation{"0":1}'].result).toBe(1);
      expect(simpleCache.cache['operation{"0":1}'].expirationDate).toBe('2015-01-03');
      done();
    })
    .catch(function (reason) {
      done(reason);
    });

  });

  it ('serializes to file', function (done) {
    simpleCache.attach(simpleService, simpleServiceCacheSettings)
    .then(function () {
      return simpleCache.operation(1);
    })
    .then(function (result) {
      return simpleCache.save();
    })
    .then(function () {
      var fs = simpleCache.fileManager;
      return fs.read(simpleServiceCacheSettings.file);
    })
    .then(function (cacheFileContent) {
      expect(cacheFileContent).toBe('{"operation{\\"0\\":1}":{"expirationDate":"2015-01-03","result":1}}');
      done();
    })
    .catch(function (reason) {
      done(reason);
    });

  });

  function getFileManager(cacheContent) {
    var MockFs = require('q-io/fs-mock');
    var mockFs = MockFs({
      "root": {
        "tvRageCache": JSON.stringify(cacheContent)
      }
    });

    return mockFs;
  }

  function getDateService(now) {
    return {
      currentDate: function () {
        return now;
      }
    }
  }

});
