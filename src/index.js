'use strict';

const moment = require('moment');

require('./util/promise');

const taskFactory = require('./taskFactory');
const loadOrCreateConfig = require('./config').loadOrCreate;
const logger = require('./logger');

class CaptainSparrow {

    constructor(args, options) {
        this.args = args;
        this.options = options;
    }

    async run() {

        validateArguments(this.args);

        try {
            const configuration = await loadOrCreateConfig(this.options.config);
            var settings = modifyConfigWithCliOptions(configuration, this.options, this.args);
            const task = await taskFactory.resolve(this.args[0], settings);
            await task.execute();
        } catch (err) {
            logger.error(`Unhandled application error occurred: ${ err.stack }`);
            process.exit(-1);
        }
    };
}

function validateArguments(args) {
    if (!args.length) {
        console.error('Provide a task name as first argument: [tv|search|subs]');
        process.exit(1);
    }
}

function modifyConfigWithCliOptions(config, options, args) {
    if (options.since) {
        var parsedSince = moment(options.since, 'YYYY-MM-DD');
        if (!parsedSince.isValid()) {
            throw new Error('Invalid --since. Should be YYYY-MM-DD');
        }

        config.tv.episodesSince = parsedSince.toDate();
    }

    if (options.show) {
        config.shows = [ options.show ];
    }

    if (args[0] === 'search') {
        config.search.term = args.slice(-1)[0];

        if (options.save) {
            config.search.save = options.save;

            if (options.index) {
                config.search.index = options.index;
            }
        }

    }

    return config;
}

module.exports = CaptainSparrow;