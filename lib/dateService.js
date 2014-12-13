
var moment = require('moment');

module.exports = {
  currentDate: currentDate
};

function currentDate() {
  return moment().toDate();
}
