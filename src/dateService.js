'use strict';

const moment = require('moment');

function currentDate() {
    return moment().startOf('day').toDate();
}

function currentDateTime() {
    return moment().toDate();
}

module.exports = { currentDate, currentDateTime };
