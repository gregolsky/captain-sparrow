module.exports = Diyvod;

require('./include').setup(__dirname);

var moment = require('moment'),
    winston = require('winston');

var taskFactory = include('taskFactory'),
    fileManager = include('fileManager'),
    config = include('config');

function Diyvod(args, options) {
  this.args = args;
  this.options = options;
}

Diyvod.prototype.run = function () {

  var self = this;

  validateArguments(self.args);

  var logger = configureLogging();

  return config.loadOrCreate(fileManager)
  .then(function(configuration) {
    var settings = modifyConfigWithCliOptions(configuration, self.options, self.args);
    return taskFactory.resolve(self.args[0], settings, fileManager, logger)
  })
  .then(function (task) {
    return task.execute();
  });
}

function validateArguments(args) {
  if (!args.length) {
    throw new Error('Provide a task name as first argument: [tv|search]');
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
    config.shows  = [ options.show ];
  }

  if (args[0] == 'search') {
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

function configureLogging() {

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
      filename: '/tmp/diyvod.log',
      handleExceptions: true,
      json: false,
      colorize: true,
      timestamp: true
    })
    ]
  });
}
