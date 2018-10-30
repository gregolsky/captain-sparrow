const LimeTorrents = require('./limeTorrents');
const TorrentApiOrg = require('./torrentApiOrg');
const Tpb = require('./tpb');
const timeout = require('../util/timeout');
const logger = require('../logger');

const SERVICES = {
    Tpb: new Tpb(),
    LimeTorrents: new LimeTorrents(),
    TorrentApiOrg: new TorrentApiOrg()
};

class TorrentProvider {

    constructor(settings) {
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

    async search(term) {
        logger.info(`Searching for '${ term }'...`);

        let allErrors = [];
        for (const service of this.providers) {

            try {
                const results = await this._serviceSearch(service, term);
                const filtered = this._verifyResults(results, term);
                if (filtered && filtered.length) {
                    return filtered;
                }
            } catch (err) {
                logger.warn(`Search error (${ service.constructor.name }): ${ err.stack }.`);
                allErrors.push(err);
            }

        }

        if (allErrors.length) {
            let errStr = allErrors.map(x => x.stack).join('\n\n');
            throw new Error(`Search failed. Errors: ${ errStr }.`);
        }

        return [];
    }

    async _serviceSearch(service, term) {
        return Promise.race([
            service.search(term),
            timeout(10000)
        ]);
    }

    _verifyResults(results, term) {
        if (!results || !results.length) {
            return [];
        }

        const termTokens = term.split(' ').map(x => x.toLowerCase());
        return results.filter(x => x.name && containsAllTokens(x.name, termTokens));

        function containsAllTokens(name, termTokens) {
            const nameLower = name.toLowerCase();
            const result = termTokens.every(token => nameLower.includes(token));
            return result;
        }

    }

}

module.exports = TorrentProvider;
