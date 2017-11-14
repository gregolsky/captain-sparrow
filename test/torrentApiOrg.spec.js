const TorrentApiOrg = require('captain-sparrow/torrentProvider/torrentApiOrg');
const moment = require('moment');

describe('torrentapi.org client', function () {

    /* Integration test */
    it('finds some torrents', function () {

        var torrentProject = new TorrentApiOrg();
        return torrentProject.search('test')
        .then(function (results) {
            should.exist(results);
            results.length.should.to.be.above(0);

            var entry = results[0];

            should.exist(entry);
            should.exist(entry.name);
            should.exist(entry.torrentLink);
        });
    }, 10000);

    it('queues search requests', function () {

        this.timeout(30000);

        let torrentProject = new TorrentApiOrg();
        let searches = {};

        function recordSearch (term) {
            return torrentProject.search(term)
                .then(results => {
                    searches[term] = {
                        finishedAt: moment().toDate(),
                        results: results.slice(0, 2)
                    };
                })
                .catch(err => {
                    searches[term] = {
                        finishedAt: moment().toDate(),
                        results: err
                    };
                });
        }

        let search1 = recordSearch('walking');
        let search2 = recordSearch('robot');
        let search3 = recordSearch('game');

        return Promise.all([ search1, search2, search3 ])
        .then(() => {
            expect(Object.keys(searches))
                .to.have.ordered.members(['walking', 'robot', 'game']);
        });
    }, 20000);

});
