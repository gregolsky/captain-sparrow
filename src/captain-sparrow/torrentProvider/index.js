import LimeTorrents from './limeTorrents';
import TorrentApiOrg from './torrentApiOrg';
import timeout from 'captain-sparrow/util/timeout';
import logger from 'captain-sparrow/logger';

const SERVICES = {
    LimeTorrents: new LimeTorrents(),
    TorrentApiOrg: new TorrentApiOrg()
};

export default class TorrentProvider {

    constructor (settings) {
        this.searchTimeout = settings.searchTimeout * 1000 || 30000;
        this.providers = (settings.searchServices || Object.keys(SERVICES))
        .reduce((result, serviceName) => {
            let service = SERVICES[serviceName];
            if (!service) {
                throw new Error(`Unknown service: ${ serviceName }`);
            }

            result.push(service);
            return result;
        }, []);
    }

    search (term) {
        logger.info(`Searching for '${ term }'...`);

        let allErrors = [];
        return this.providers.reduce((chain, service) => {
            return chain
                .catch(err => {
                    logger.warn(`Search error: ${ err.stack }.`);
                    allErrors.push(err);
                    return this._serviceSearch(service, term);
                })
                .then(results => {
                    if (results && results.length) {
                        return results;
                    }

                    return this._serviceSearch(service, term);
                });
        }, Promise.resolve())
        .then(results => !results ? [] : results)
        .catch(err => {
            allErrors.push(err);
            let errStr = allErrors.map(x => x.stack).join('\n\n');
            throw new Error(`Search failed. Errors: ${ errStr }.`);
        });
    }

    _serviceSearch (service, term) {
        return Promise.race([
            service.search(term),
            timeout(30000)
        ]);
    }

}
