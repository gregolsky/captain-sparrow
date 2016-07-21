import http from 'q-io/http';
import qs from 'qs';

const SORT = 'seeders';
const OUT = 'json';
const BASE = 'https://torrentproject.se';

export default class TorrentProjectClient {
  search (term) {
    var searchUrl = buildUrl(term);
    return http.read(searchUrl)
      .then(JSON.parse)
      .then(Array.from)
      .then(results => results.slice(0, results.length - 1))
      .then(results => results.map(addLink));
  }
}

function addLink (result) {
  return Object.assign(result, {
    torrent_link: `${ BASE }/torrent/${result.torrent_hash.toUpperCase()}.torrent`
  });
}

function buildUrl (term) {
  var query = {
    s: term,
    orderby: SORT,
    out: OUT
  };
  var queryString = qs.stringify(query);
  return `${ BASE }?${queryString}`;
}
