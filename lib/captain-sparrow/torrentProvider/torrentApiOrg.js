import qs from 'qs';
import moment from 'moment';
import request from 'request-promise-native';
import delay from 'captain-sparrow/util/delay';

const REQUEST_COOLDOWN = moment.duration(2500, 'ms').asMilliseconds();
const BASE = 'https://torrentapi.org/pubapi_v2.php';

export default class TorrentApiOrg {

    constructor () {
        this._requestQueue = [];
        this._token = null;
        this._isProcessing = false;
    }

    search (term) {
        return new Promise((resolve, reject) => {
            this._requestQueue.push({
                term, resolve, reject
            });

            this._process();
        })
        .then(results => results.map(x => this._mapResultEntry(x)));
    }

    _mapResultEntry(entry) {
        return {
            name: entry.filename,
            torrentLink: entry.download
        };
    }

    _process () {
        if (this._isProcessing) {
            return;
        }

        this._isProcessing = true;

        this._requestQueue.reduce((chain, reqPromise) => {
            return chain
            .then(() => this._handleSearchRequest(reqPromise))
            .then(() => delay(REQUEST_COOLDOWN));
        }, this._retrieveToken())
        .then(() => {
            this._isProcessing = false;
        });
    }

    _handleSearchRequest ({ term, reject, resolve }) {
        return request({
            uri: this._buildUrl(term),
            json: true
        })
        .then(result => {
            if (result['error_code']) {
                reject(new Error(`Error searching for ${ term }: [${ result.error_code }] ${ result.error }.`));
            }

            resolve(result.torrent_results);
        })
        .catch(reject);
    }

    _retrieveToken () {
        if (this._token) {
            return Promise.resolve(this._token);
        }

        return request({
            uri: `${ BASE }?get_token=get_token`,
            json: true
        })
        .then(x => {
            this._token = x.token;
        });
    }

    _buildUrl (term) {
        let query = {
            mode: 'search',
            token: this._token,
            search_string: term
        };

        let queryString = qs.stringify(query);
        return `${ BASE }?${ queryString }`;
    }
}
