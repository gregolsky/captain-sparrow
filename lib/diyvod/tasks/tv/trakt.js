var trakt = require('node-trakt'),
http = require('q-io/http'),
moment = require('moment'),
_ = require('lodash');

var TRAKT_API_URL = 'http://api.trakt.tv';
var USER_CALENDAR_SHOWS = 'user/calendar/shows.json';

function TraktClient(apiKey, logger) {
  this.apiKey = apiKey;
  this.logger = logger;
}

TraktClient.prototype.userCalendarShows = userCalendarShows;

function userCalendarShows(username, date, days) {

  var parameters = [ this.apiKey, username, moment(date).format('YYYYMMDD'), days ];

  var requestUrl = buildRequestUrl(USER_CALENDAR_SHOWS, parameters)
  this.logger.debug(requestUrl);

  return http.read(requestUrl)
  .then(function (responseBody) {
    return JSON.parse(responseBody);
  });
}

function buildRequestUrl(operation, parameters) {
  return [ TRAKT_API_URL, operation ].concat(parameters).join('/');
}

module.exports = TraktClient;
