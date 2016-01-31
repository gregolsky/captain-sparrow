'use strict';

var path = require('path');

export function setup (dir) {
    global.APP_ROOT = dir;
    global.include = include;
}

function include (relModulePath) {
    var absPath = path.join(global.APP_ROOT, relModulePath);
    return require(absPath);
}
