
var moment = require('moment');

module.exports = {
  currentDate: currentDate,
  currentDateTime: currentDateTime
};

function currentDate() {
  return moment().startOf('day').toDate();
}

function currentDateTime() {
  return moment().toDate();
}

