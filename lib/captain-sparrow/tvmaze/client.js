'use strict';

var request = require('request'),
qs = require('qs'),
q = require('q');

const API_URL = 'http://api.tvmaze.com';

export default class TvMaze {

    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    search(show) {
        var url = buildRequestUrl('/search/shows', { q: show });
        return performRequest.call(this, url);
    }

    showInfo(showid) {
        var url = buildRequestUrl(`/shows/${showid}`);
        return performRequest.call(this, url);
    }

    episodeList(showid) {
        var url = buildRequestUrl(`/shows/${showid}/episodes`);
        return performRequest.call(this, url);
    }

}

function performRequest(url) {
    var deferred = q.defer();

    request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            deferred.resolve(JSON.parse(body));
            return;
        }
        
        deferred.reject(error || new Error(body));
    });

    return deferred.promise;
}

function buildRequestUrl(urlPart, args) {
    if (args){
        var query = qs.stringify(args);
        return `${ API_URL }${ urlPart }?${ query }`;
    }

    return `${ API_URL }${ urlPart }`;
}
