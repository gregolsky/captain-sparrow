describe('Task factory', function () {

  var taskFactory = require('../lib/diyvod/tasks/taskFactory');
  var fakeSettings = {
    trakt: {
      apiKey: '',
      username: '',
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

  it('resolves dependencies for tv shows download task', function () {
  
    var task = taskFactory.resolve('tv', fakeSettings);
    expect(task).toBeDefined();
    expect(task.execute).toBeDefined();

  });

});
