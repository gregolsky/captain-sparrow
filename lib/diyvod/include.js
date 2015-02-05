module.exports = {
  setup: setup
}

var path = require('path');

function setup(dir) {
  global.APP_ROOT = dir;
  global.include = include;
}

function include(relModulePath) {
  var absPath = path.join(APP_ROOT, relModulePath);
  return require(absPath);
}

