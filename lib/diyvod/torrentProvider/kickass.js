module.exports = KickassTorrentsClient;

var http = require('q-io/http');

var SORT = 'seeders';
var ORDER = 'desc';
var BASE = 'https://kickass.to/json.php'

function KickassTorrentsClient() { }

KickassTorrentsClient.prototype.search = search;

function search(term, page) {

    if (!page) {
        page = 1;
    }

    var searchUrl = buildUrl(term, page);
    return http.read(searchUrl)
    .then(function (responseBody) {
        return JSON.parse(responseBody);
    });
}

function buildUrl(term, page) {
    return BASE + 
        '?' +
        'q=' + encodeURIComponent(term) +
        '&field=' + SORT +
        '&order=' + ORDER +
        '&page=' + page;
}

