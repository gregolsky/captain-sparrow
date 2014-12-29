module.exports = Diyvod;

var taskFactory = require('./diyvod/tasks/taskFactory'),
  config = require('./diyvod/config'),
  moment = require('moment'),
  winston = require('winston');

function Diyvod(args, options) {
  this.args = args;
  this.options = options;
}

Diyvod.prototype.run = function () {
  
  configureLogging();

  var config = config.loadOrCreate();
  var settings = modifyConfigWithCliOptions(config, this.options);

  var task = taskFactory.resolve(this.args[0], settings);
  return task.execute();
}

function modifyConfigWithCliOptions(config, options) {

  if (options.since) {
     var parsedSince = moment(options.since, 'YYYY-MM-DD');
    if (!parsedSince.isValid()) {
      throw new Error('Invalid --since. Should be YYYY-MM-DD');
    }

    config.tv.since = parsedSince.toDate();
  }

  return config;
}

function configureLogging() {
  winston.add(winston.transports.File, { 
    filename: '/tmp/diyvod.log',
    handleExceptions: true
  });
}
