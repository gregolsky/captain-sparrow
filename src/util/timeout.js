'use strict';

const moment = require('moment');

function timeout(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() =>
            reject(new Error(`Timeout reached after ${ moment.duration(ms).humanize() }.`)), ms);
    });
}

module.exports = timeout;
