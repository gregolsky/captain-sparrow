import winston from 'winston';

const CONSOLE_TRANSPORT = new (winston.transports.Console)({
    level: 'debug',
    colorize: true,
    //handleExceptions: true,
    humanReadableUnhandledException: true,
    json: false,
    timestamp: true
});

const FILE_TRANSPORT =  new (winston.transports.File)({
    level: 'info',
    filename: '/tmp/captain-sparrow.log',
    //handleExceptions: true,
    humanReadableUnhandledException: true,
    json: false,
    colorize: true,
    timestamp: true
});

let logger;

configureDefaults();

export default logger;

function getDefaultLogger () {
    return new (winston.Logger)({
        transports: [ CONSOLE_TRANSPORT, FILE_TRANSPORT ]
    });
}

export function configureDefaults() {
    logger = getDefaultLogger();
}

export function configureFake() {
    logger = new (winston.Logger)({ transports: [] });
}
