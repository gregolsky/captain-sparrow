
import request from 'request-promise-native';
import { parseString } from 'xml2js';

const BASE = 'https://www.limetorrents.cc/searchrss';

export default class LimeTorrents {

    search (term) {
        const uri = this._buildUrl(term);

        return request(uri)
        .then(body => this._parseXml(body))
        .then(results => results.rss.channel[0].item)
        .then(results => results.map(x => this._mapResultEntry(x)))
        .then(results => {
            results.sort(function (a, b) {
                // by seeds descending
                return a.seeds < b.seeds ? 1 : -1;
            });

            return results;
        });
    }

    _mapResultEntry (entry) {
        let additionalProps = entry.description[0].split(',')
            .reduce((result, item) => {
                let [ key, val ] = item.trim()
                    .split(' ')
                    .map(x => x.toLowerCase().replace(/:/g, ''));

                let valInt = parseInt(val);
                result[key] = isNaN(valInt) ? val : valInt;
                return result;
            }, {});

        additionalProps.leechs = additionalProps.leechers;

        let mapped = {
            name: entry.title[0],
            torrentLink: entry.enclosure[0].$.url,
            pubDate: entry.pubDate[0],
            size: parseInt(entry.size[0])
        };

        const result = Object.assign(mapped, additionalProps);
        return result;
    }

    _buildUrl (term) {
        const query = global.encodeURIComponent(term);
        return `${ BASE }/${ query }`;
    }

    _parseXml (body) {
        return new Promise((resolve, reject) => {
            parseString(body, (err, result) => {
                err ? reject(err) : resolve(result);
            });
        });
    }
}
