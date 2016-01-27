'use strict';

require('./include').setup(__dirname);

var moment = require('moment'),
winston = require('winston');

include('util/promise')();

var taskFactory = include('taskFactory'),
fileManager = include('fileManager'),
config = include('config');

export default class CaptainSparrow {
    constructor (args, options) {
        this.args = args;
        this.options = options;
    }

    run () {

        validateArguments(this.args);

        var logger = configureLogging();

        return config.loadOrCreate(fileManager)
        .then((configuration) => {
            var settings = modifyConfigWithCliOptions(configuration, this.options, this.args);
            return taskFactory.resolve(this.args[0], settings, fileManager, logger);
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

function configureLogging () {

    return new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                level: 'debug',
                colorize: true,
                handleExceptions: true,
                json: false,
                timestamp: true
            }),
            new (winston.transports.File)({
                level: 'info',
                filename: '/tmp/captain-sparrow.log',
                handleExceptions: true,
                json: false,
                colorize: true,
                timestamp: true
            })
        ]
    });
}
