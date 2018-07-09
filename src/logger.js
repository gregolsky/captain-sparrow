const winston = require('winston');

let logger;

configureDefaults();

function getDefaultLogger() {
    const format = winston.format;
    const formatAlignedWithColorsAndTime = format.combine(
        format.timestamp(),
        format.align(),
        format.printf(info => `${ info.timestamp } ${ info.level }: ${ info.message }`));

    return winston.createLogger({
        level: 'info',
        format: formatAlignedWithColorsAndTime,
        transports: [
            new winston.transports.Console()
        ]
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
