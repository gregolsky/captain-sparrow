
var moment = require('moment'),
q = require('q');

module.exports = TvRageCache;

// TODO: implement it as an calls interceptor

function TvRageCache(config, tvRage, fileManager, dateService, logger) {
  this.tvRage = tvRage;
  this.fileManager = fileManager;
  this.logger = logger;
  this.dateService = dateService;

  this.cacheFilePath = config.cacheFilePath;
  this.cacheTTL = config.cacheTTL;

  this.cache = null;
}

TvRageCache.prototype.load = load;
TvRageCache.prototype.save = save;
TvRageCache.prototype.hasOperationExpired = hasOperationExpired;
TvRageCache.prototype.isOperationCached = isOperationCached;
TvRageCache.prototype.performOperation = performOperation;
TvRageCache.prototype.getOperationResult = getOperationResult;
TvRageCache.prototype.setOperationResult = setOperationResult;

function search(show) {
  var self = this;
  return self.performOperation('search', arguments, );
}

function showInfo(showid) {
  var self = this;
  return self.performOperation('showInfo', arguments);
}

function episodeList(showid) {
  var self = this;
  return self.performOperation('episodeList', arguments);
}

function load() {
  var self = this;

  self.fileManager.read(self.cacheFilePath)
  .then(function (data) {
    self.cache = JSON.parse(data);
  }, function (reason) {
    self.logger.error(reason);
    self.logger.info('Assuming new TVRage cache.');
    self.cache = {};    
  });
}

function isOperationCached(opKey) {
  return this.cache.hasOwnProperty(opKey);
}

function hasOperationExpired(opKey) {
  var expirationDate = moment(this.cache[opKey].expirationDate, 'YYYY-MM-DD');
  return self.dateService.currentDate() > expirationDate;
}

function getOperationResult(opKey) {
  return self.cache[opKey].result;
}

function setOperationResult(opKey, value, expirationDate) {
  var cacheEntry = {};
  cacheEntry.expirationDate = expirationDate;
  cacheEntry.result = value;
  self.cache[opkey] = cacheEntry;
}

function performOperation(operation, args, expirationDate) {
  var opKey = operationKey(operation, args);
  if (self.isOperationCached(opKey) && !self.hasOperationExpired(opKey)) {
    return q.when(self.getOperationResult(opKey));
  }

  return tvRage[operation].apply(tvRage, args)
  .then(function (result) {
    if (!expirationDate) {
      expirationDate = moment(self.dateService.currentDate()).add(self.cacheTTL, 'd').toDate();
    }

    self.setOperationResult(opKey, result, expirationDate);
    return result;
  });
}

function save() {
  return self.fileManager.write(self.cacheFilePath, JSON.stringify(self.cache));
}

function operationKey(opName, args) {
  return opName + JSON.stringify(args);
}
