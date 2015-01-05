var http = require('q-io/http'),
    xml2js = require('xml2js'),
    q = require('q');

module.exports = TvRage;

var API_URL = 'http://services.tvrage.com/myfeeds/'

function TvRage(apiKey) {
  this.apiKey = apiKey;
}

TvRage.prototype.search = search;
TvRage.prototype.showInfo = showInfo;
TvRage.prototype.episodeList = episodeList;
TvRage.prototype.request = request;
TvRage.prototype.buildRequestUrl = buildRequestUrl;

function search(show) {
  var self = this;
  var url = self.buildRequestUrl('search', { show: show });
  return self.request(url);
}

function showInfo(showid) {
  var self = this;
  var url = self.buildRequestUrl('showinfo', { sid: showid });
  return self.request(url);
}

function episodeList(showid) {
  var self = this;
  var url = self.buildRequestUrl('episode_list', { sid: showid });
  return self.request(url);
}

function request(url) {
  return http.read(url)
    .then(function (xml) {
      return q.nfcall(xml2js.parseString, xml);
    });
}

function buildRequestUrl(type, args) {
  var self = this;

  var result = API_URL + type + '.php';
  result += '?';
  result += 'key=' + self.apiKey;

  for (var key in args) {
    result += '&' + key + '=' + encodeURIComponent(args[key]);
  }

  return result;
}
