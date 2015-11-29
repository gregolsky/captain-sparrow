module.exports = {
    currentDate: currentDate,
    currentDateTime: currentDateTime
};

var moment = require('moment');

function currentDate () {
    return moment().startOf('day').toDate();
}

function currentDateTime () {
    return moment().toDate();
}

