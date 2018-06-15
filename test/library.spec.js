const Episode = require('../src/tv/episode');
const TvShowsLibrary = require('../src/library');
const path = require('path');

describe('TV shows library', function() {

    const libraryPath = path.join(__dirname, 'data/library');

    it('initializes library from directory', async () => {
        var library = new TvShowsLibrary({ tv: { libraryPath } });
        await library.initialize();
        should.exist(library.entries);
        should.exist(library.entries.length);
        library.entries.length.should.equal(2);
    });

    it('can check if episode is already in', async () => {
        // function Episode(show, number, season, title, airtime, runtime) {

        var episode = new Episode('Most stupid show  ever', '02', '04', '', null, null);
        var library = new TvShowsLibrary({ tv: { libraryPath } });

        await library.initialize();
        var episodeInLibrary = library.contains(episode);
        episodeInLibrary.should.be.true();
    });

    it('stupid show has subtitles', async () => {

        const library = new TvShowsLibrary({ tv: { libraryPath } });

        await library.initialize();
        expect(library.entries[0].subsPath).to.exist();
        library.entries[0].subsPath.should.equal(
            path.join(__dirname, 'data/library/a/Most.stupid.show.ever.s04e02.hdtv.txt'));
        library.entries[0].hasSubtitles.should.be.true();

        library.entries[1].hasSubtitles.should.be.false();
    });

});
