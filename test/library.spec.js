const Episode = require('captain-sparrow/tv/episode');
const TvShowsLibrary = require('captain-sparrow/library');

describe('TV shows library', function () {

    var mockFs = {
        'root': {
            'a': {
                'b': {
                    'c.txt': 'Content of a/b/c.txt',
                    'fun.stuff.s01e01.mkv': 'asdg'
                },
                'Most.stupid.show.ever.s04e02.hdtv.mkv': 'asdg',
                'Most.stupid.show.ever.s04e02.hdtv.txt': 'asdg'
            }
        }
    };

    useMockery(beforeEach, afterEach, () => ({
        'fs': global.getFsMock(mockFs)
    }));

    it('initializes library from directory', () => {
        var library = new TvShowsLibrary({ tv: { libraryPath: 'root/a' } });
        return library.initialize()
        .then(function () {
            should.exist(library.entries);
            should.exist(library.entries.length);
            library.entries.length.should.equal(2);
        });
    });

    it('can check if episode is already in', function (done) {
        // function Episode(show, number, season, title, airtime, runtime) {

        var episode = new Episode('Most stupid show  ever', '02', '04', '', null, null);
        var library = new TvShowsLibrary({ tv: { libraryPath: 'root/a' } }, mockFs);

        library.initialize()
        .then(function () {
            var episodeInLibrary = library.contains(episode);
            episodeInLibrary.should.be.true();
            done();
        })
        .catch(done);
    });

    it('stupid show has subtitles', (done) => {

        var library = new TvShowsLibrary({ tv: { libraryPath: 'root/a' } }, mockFs);

        library.initialize()
        .then(() => {
            expect(library.entries[0].subsPath).to.exist();
            library.entries[0].subsPath.should.equal('root/a/Most.stupid.show.ever.s04e02.hdtv.txt');
            library.entries[0].hasSubtitles.should.be.true();

            library.entries[1].hasSubtitles.should.be.false();
            done();
        })
        .catch(done);
    });

});
