import request from 'request-promise-native';
import cheerio from 'cheerio';

export default class ThePirateBay {

    search (term) {
        return request({
            uri: this._buildUrl(term),
            transform: function (body) {
                return cheerio.load(body);
            }
        })
        .then($ => {
            return $('table#searchResult tbody tr').map(mapResult).get();

            function mapResult (i, row) {
                const $row = $(row);
                return {
                    name: ($row.find('.detName').text() || '').trim(),
                    torrentLink: $row.find('a[href^=magnet]').attr('href')
                };
            }
        });
    }

    _buildUrl (term) {
        const encTerm = encodeURIComponent(term);
        return `https://thepiratebay.org/search/${ encTerm }/0/7/0`;
    }
}