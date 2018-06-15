const TorrentApiOrg = require('../src/torrentProvider/torrentApiOrg');
const assert = require('assert');
const moment = require('moment');

describe('torrentapi.org client', function() {

    let torrentProject;

    before(() => {
        torrentProject = new TorrentApiOrg();
    });

    it('can retrieve auth token', async function() {
        await torrentProject._retrieveToken();
        assert.ok(torrentProject._token);
    });

    /* Integration test */
    it('finds some torrents', async function() {
        this.timeout(10000);
        const results = await torrentProject.search('test');
        should.exist(results);
        results.length.should.to.be.above(0);

        var entry = results[0];
        should.exist(entry);
        should.exist(entry.name);
        should.exist(entry.torrentLink);
    });

    it('queues search requests', async function() {
        this.timeout(30000);

        let searches = {};

        async function recordSearch(term) {
            try {
                const results = await torrentProject.search(term);
                searches[term] = {
                    finishedAt: moment().toDate(),
                    results: results.slice(0, 2)
                };
            } catch (err) {
                searches[term] = {
                    finishedAt: moment().toDate(),
                    results: err
                };

            }
        }

        let search1 = recordSearch('walking');
        let search2 = recordSearch('robot');
        let search3 = recordSearch('game');

        await Promise.all([ search1, search2, search3 ]);
        expect(Object.keys(searches))
            .to.have.ordered.members(['walking', 'robot', 'game']);
    });

});
