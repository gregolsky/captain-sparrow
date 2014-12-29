
var expandUserDir = require('expand-home-dir');
var fs = require('./fileManager');
var q = require('q');

//TODO tests
function loadOrCreate() {
  var configFilePath = expandUserDir('~/.diyvod');

  return fs.exists(configFilePath)
  .then(function (fileExists) {
    if (!fileExists) {
      return fs.write(configFilePath, JSON.stringify(defaults(), null, '  '))
        .then(function () {
          throw new Error('Configuration is incomplete. Fill in your ~/.diyvod.');
        });
    }

    return fs.read(configFilePath);
  })
  .then(function (json) {
    return JSON.parse(json);
  });
}

function defaults () {
  return {
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
}

module.exports = {
  loadOrCreate: loadOrCreate
};
