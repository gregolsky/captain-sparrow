module.exports = TransmissionClient;

var Transmission = require('transmission'),
q = require('q');

function TransmissionClient(settings) {
  this.settings = settings;
}

TransmissionClient.prototype.list = function () {
  var deferred = q.defer();

  try {
    this.buildClient()
    .get(function (err, arg) {
      if (err) {
        deferred.reject(err);
        return;
      }

      deferred.resolve(arg.torrents);
    });
  }
  catch (err) {
    deferred.reject(err);
  }

  return deferred.promise;
}

TransmissionClient.prototype.addUrl = function (url, options) {
  var deferred = q.defer();

  try {
    this.buildClient()
    .addUrl(url, options, function (err, arg) {
      if (err) {
        deferred.reject(err);
      }

      deferred.resolve(arg);
    });
  }
  catch (err) {
    deferred.reject(err);
  }


  return deferred.promise;
}

TransmissionClient.prototype.buildClient = function () {
  return new Transmission(this.settings.transmission);
}

