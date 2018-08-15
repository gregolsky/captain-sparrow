const stream = require('readable-stream');
const logger = require('../logger');

class EpisodeProviderStream extends stream.Readable {

    constructor(episodesSource) {
        super({ objectMode: true });

        this.source = episodesSource;

    }

    _read(size) {
        const processing = this.source()
            .map(({ name, promise }) => {
                return promise
                    .then(episodesResult => {
                        if (!episodesResult.length) {
                            return;
                        }

                        logger.info(`${ episodesResult.length } episodes found for ${ name }.`);
                        episodesResult.forEach(x => this.push(x));
                    })
                    .catch(reason => {
                        reason = reason.stack || reason;
                        logger.error(name + '\n' + reason);
                    });
            });

        Promise.all(processing)
            .then(() => this.push(null));
    }
}

module.exports = EpisodeProviderStream;
