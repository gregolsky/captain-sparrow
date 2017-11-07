'use strict';

var moment = require('moment');

export function currentDate () {
    return moment().startOf('day').toDate();
}

export function currentDateTime () {
    return moment().toDate();
}
