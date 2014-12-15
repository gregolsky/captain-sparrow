
var expandUserDir = require('expand-user-dir');
var fs = require('q-io/fs');
var q = require('q');

function loadOrCreate () {
  var configFilePath = expandUserDir('~/.diyvod');
  fs.exists(configFilePath)
  .then(function (fileExists) {
    if (!fileExists) {
      return fs.write(configFilePath, JSON.strigify(defaults()))
    }

    return Q.when(null);
  })
  .then(function () {
    return fs.read(configFilePath);
  })
  .then(function (json) {
    return JSON.parse(json);
  });
}

function defaults () {
  return {
    traktApiKey: '',
    traktUsername: '',
    torrentSearchSuffix: ''
  };
}

module.exports = {
  loadOrCreate: loadOrCreate
};
