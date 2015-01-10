var createICal = require('ical-generator'),
    moment = require('moment'),
    q = require('q'),
    _ = require('lodash');

module.exports = EpisodesICalExporter;

function EpisodesICalExporter(exportFilePath) {
  this.exportFilePath = exportFilePath;
}

EpisodesICalExporter.prototype.export = function (episodes) {

  var ical = createICal();

  _.each(episodes, function (e, i) {

    ical.addEvent({
      start: e.airtime,
      end: moment(e.airtime).add(e.runtime, 'm').toDate(),
      summary: e.describe() + ' ' + e.title
    });

  });

  var deferred = q.defer();

  ical.save(this.exportFilePath, function (err) {
    if (err) {
      deferred.reject(err);
      return;
    }

    deferred.resolve();
  });

  return deferred.promise; 
}
