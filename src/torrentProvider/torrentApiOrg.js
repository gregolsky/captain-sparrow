const qs = require('qs');
const moment = require('moment');
const request = require('request-promise-native');
const delay = require('../util/delay');

const REQUEST_COOLDOWN = moment.duration(2500, 'ms').asMilliseconds();
const BASE = 'https://torrentapi.org/pubapi_v2.php';

const APP_ID = 'cptsprrw';

const REQUEST_DEFAULTS = {
    json: true,
    headers: {
        'User-Agent': APP_ID + ' Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36',
    }
};

class TorrentApiOrg {

    constructor() {
        this._token = null;
        this._queue = Promise.resolve();
    }

    async search(term) {
        return new Promise((resolve, reject) => {
            try {
                this._process({
                    term, resolve, reject
                });
            } catch (err) {
                reject(err);
            }
        })
            .then(results => results.map(x => this._mapResultEntry(x)));
    }

    _mapResultEntry(entry) {
        return {
            name: entry.filename,
            torrentLink: entry.download
        };
    }

    _process(req) {
        this._queue = this._queue
            .then(() => {
                return this._retrieveToken(req)
                    .then(() => this._handleSearchRequest(req))
                    .then(req.resolve)
                    .catch(req.reject);
            })
            .then(() => delay(REQUEST_COOLDOWN));
    }

    async _handleSearchRequest({ term }) {
        const reqParams = Object.assign({
            uri: this._buildUrl(term),
            json: true
        }, REQUEST_DEFAULTS);
        const result = await request(reqParams);
        if (result['error_code']) {
            throw new Error(`Error searching for ${ term }: [${ result.error_code }] ${ result.error }.`);
        }

        return result.torrent_results;
    }

    async _retrieveToken() {
        if (this._token) {
            return this._token;
        }

        const requestParams = Object.assign({
            method: 'GET',
            uri: `${ BASE }?get_token=get_token&app_id=${ APP_ID }`
        }, REQUEST_DEFAULTS);
        const tokenResult = await request(requestParams);
        this._token = tokenResult.token;
        await delay(2000);
    }

    _buildUrl(term) {
        let query = {
            mode: 'search',
            token: this._token,
            search_string: term,
            app_id: APP_ID
        };

        let queryString = qs.stringify(query);
        return `${ BASE }?${ queryString }`;
    }
}

module.exports = TorrentApiOrg;
