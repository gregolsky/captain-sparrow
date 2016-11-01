'use strict';

import moment from 'moment';

import enhancePromise from 'captain-sparrow/util/promise';
enhancePromise();

import taskFactory from 'captain-sparrow/taskFactory';
import fs from 'captain-sparrow/fs';
import config from 'captain-sparrow/config';
import logger from 'captain-sparrow/logger';

export default class CaptainSparrow {

    constructor (args, options) {
        this.args = args;
        this.options = options;
    }

    run () {

        validateArguments(this.args);

        return config.loadOrCreate()
        .then((configuration) => {
            var settings = modifyConfigWithCliOptions(configuration, this.options, this.args);
            return taskFactory.resolve(this.args[0], settings);
        })
        .then((task) => task.execute());
    };
}

function validateArguments (args) {
    if (!args.length) {
        throw new Error('Provide a task name as first argument: [tv|search]');
    }
}

function modifyConfigWithCliOptions (config, options, args) {
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
