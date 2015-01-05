
var moment = require('moment'),
q = require('q'),
_ = require('lodash');

module.exports = Cache;

function Cache(fileManager, dateService, logger) {

  this.fileManager = fileManager;
  this.logger = logger;
  this.dateService = dateService;

  this.cacheFilePath = null;
  this.cacheTTL = null;
  this.operations = null;

  this.service = null;
  this.cache = null;
}

Cache.prototype.attach = attach;
Cache.prototype.load = load;
Cache.prototype.save = save;
Cache.prototype.performOperation = performOperation;
Cache.prototype.hasOperationExpired = hasOperationExpired;
Cache.prototype.isOperationCached = isOperationCached;
Cache.prototype.getOperationResult = getOperationResult;
Cache.prototype.setOperationResult = setOperationResult;
Cache.prototype.calcExpirationDate = calcExpirationDate;

function load() {
  var self = this;

  return self.fileManager.read(self.cacheFilePath)
  .then(function (data) {
    self.cache = JSON.parse(data);
  }, function (reason) {
    self.logger.error(reason);
    self.logger.info('Assuming new cache.');
    self.cache = {};    
  });
}

function attach(service, config) {
  var self = this;
  self.service = service;

  self.cacheFilePath = config.file;
  self.cacheTTL = config.ttl;
  self.operations = config.operations;

  _.each(self.operations, function (operation) { 
    self[operation] = function () {
      return self.performOperation(operation, arguments);
    };
  });

  return self.load();
}


function isOperationCached(opKey) {
  return this.cache.hasOwnProperty(opKey);
}

function hasOperationExpired(opKey) {
  var expirationDate = moment(this.cache[opKey].expirationDate, 'YYYY-MM-DD').toDate();
  return this.dateService.currentDate() > expirationDate;
}

function getOperationResult(opKey) {
  return self.cache[opKey].result;
}

function setOperationResult(opKey, value, expirationDate) {
  var cacheEntry = {};
  cacheEntry.expirationDate = moment(expirationDate).format('YYYY-MM-DD');
  cacheEntry.result = value;
  this.cache[opKey] = cacheEntry;
}

function performOperation(operation, args) {
  var self = this;
  var opKey = operationKey(operation, args);
  if (self.isOperationCached(opKey) && !self.hasOperationExpired(opKey)) {
    return q.when(self.getOperationResult(opKey));
  }

  return self.service[operation].apply(self.service, args)
  .then(function (result) {
    var expirationDate = self.calcExpirationDate(operation);
    self.setOperationResult(opKey, result, expirationDate);

    return result;
  });
}

function save() {
  var self = this;
  return self.fileManager.write(self.cacheFilePath, JSON.stringify(self.cache));
}

function operationKey(opName, args) {
  return opName + JSON.stringify(args);
}

function calcExpirationDate(operation) {
  var self = this;
  return moment(self.dateService.currentDate())
  .add(self.cacheTTL[operation], 'd')
  .toDate();
}
