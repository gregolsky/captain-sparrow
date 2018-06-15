'use strict';

const request = require('request-promise-native');
const qs = require('qs');

const API_URL = 'http://api.tvmaze.com';

class TvMaze {

    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    search(show) {
        var url = buildRequestUrl('/search/shows', { q: show });
        return this._performRequest(url);
    }

    showInfo(showid) {
        var url = buildRequestUrl(`/shows/${ showid }`);
        return this._performRequest(url);
    }

    episodeList(showid) {
        var url = buildRequestUrl(`/shows/${ showid }/episodes`);
        return this._performRequest(url);
    }

    _performRequest(url) {
        return request({
            uri: url,
            json: true
        });
    }

}

function buildRequestUrl(urlPart, args) {
    if (args) {
        var query = qs.stringify(args);
        return `${ API_URL }${ urlPart }?${ query }`;
    }

    return `${ API_URL }${ urlPart }`;
}

module.exports = TvMaze;
