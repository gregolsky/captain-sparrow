describe('Task factory', function () {

  var taskFactory = require('../lib/captain-sparrow/taskFactory');
  var fakeSettings = {
    trakt: {
      apiKey: '',
      username: '',
    },
    tvmaze: {
      apiKey: '',
      shows: [],
      cache: {
        file: '',
        operations: [ 'search', 'showInfo', 'episodeList' ],
        ttl: {
          search: 30,
          showInfo: 30,
          episodeList: 7
        }
      },
    },
    transmission: {
      host: 'localhost',
      port: '9091'
    },
    tv: {
      searchSuffix: '',
      hoursAfterAirTime: 4,
      libraryPath: '',
      downloadDirectory: ''
    }
  };

  var MockFs = require('q-io/fs-mock');
  var mockFs = MockFs({
    "root": {
      "a": {
        "b": {
          "c.txt": "Content of a/b/c.txt",
          "fun.stuff.s01e01.mkv": 'asdg'
        },
        "Most.stupid.show.ever.s04e02.hdtv.mkv": 'asdg'
      }
    }
  });

  it('resolves dependencies for tv shows download task', function () {

    taskFactory.resolve('tv', fakeSettings, mockFs)
      .then(function (task) {
        expect(task).toBeDefined();
        expect(task.execute).toBeDefined();
      });

  });

});
