import moment from 'moment';
import { readFile, writeFile } from 'captain-sparrow/fs';
import logger from 'captain-sparrow/logger';

export default class Cache {

    constructor (dateService) {
        this.dateService = dateService;

        this.cacheFilePath = null;
        this.cacheTTL = null;
        this.operations = null;

        this.service = null;
        this.cache = null;
    }

    load () {
        return readFile(this.cacheFilePath, 'utf8')
        .then(data => {
            this.cache = JSON.parse(data);
        }, reason => {
            logger.error(reason);
            logger.info('Assuming new cache.');
            this.cache = {};
        });
    }

    attach (service, config) {
        this.service = service;

        this.cacheFilePath = config.file;
        this.cacheTTL = config.ttl;
        this.operations = config.operations;

        this.operations.forEach(operation => {
            this[operation] = (...args) => this.performOperation(operation, args);
        });

        return this.load();
    }

    isOperationCached (opKey) {
        return this.cache.hasOwnProperty(opKey);
    }

    hasOperationExpired (opKey) {
        var expirationDate = moment(this.cache[opKey].expirationDate, 'YYYY-MM-DD').toDate();
        return this.dateService.currentDate() > expirationDate;
    }

    getOperationResult (opKey) {
        return this.cache[opKey].result;
    }

    setOperationResult (opKey, value, expirationDate) {
        var cacheEntry = {};
        cacheEntry.expirationDate = moment(expirationDate).format('YYYY-MM-DD');
        cacheEntry.result = value;
        this.cache[opKey] = cacheEntry;
    }

    performOperation (operation, args) {
        var opKey = operationKey(operation, args);
        if (this.isOperationCached(opKey) &&
            !this.hasOperationExpired(opKey)) {
            return Promise.resolve(this.getOperationResult(opKey));
        }

        var serviceOpPromise = this.service[operation].apply(this.service, args);
        return serviceOpPromise
        .then((result) => {
            var expirationDate = this.calcExpirationDate(operation);
            this.setOperationResult(opKey, result, expirationDate);

            return result;
        });
    }

    save () {
        return writeFile(this.cacheFilePath, JSON.stringify(this.cache));
    }

    calcExpirationDate (operation) {
        return moment(this.dateService.currentDate())
        .add(this.cacheTTL[operation], 'd')
        .toDate();
    }
}

function operationKey (opName, args) {
    return opName + JSON.stringify(args);
}
