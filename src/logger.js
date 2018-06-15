const winston = require('winston');

const CONSOLE_TRANSPORT = new (winston.transports.Console)({
    level: 'debug',
    colorize: true,
    // handleExceptions: true,
    humanReadableUnhandledException: true,
    json: false,
    timestamp: true
});

const FILE_TRANSPORT = new (winston.transports.File)({
    level: 'info',
    filename: '/tmp/captain-sparrow.log',
    // handleExceptions: true,
    humanReadableUnhandledException: true,
    json: false,
    colorize: true,
    timestamp: true
});

let logger;

configureDefaults();

function getDefaultLogger() {
    return winston.createLogger({
        transports: [ CONSOLE_TRANSPORT, FILE_TRANSPORT ]
    });
}

function configureDefaults() {
    logger = getDefaultLogger();
}

function configureFake() {
    logger = new (winston.Logger)({ transports: [] });
}

module.exports = logger;
module.exports.configureDefaults = configureDefaults;
module.exports.configureFake = configureFake;
