
describe('fs', () => {

    let fs = require('../src/util/fs');

    it('walk() all', async function() {
        const files = await fs.walk('./test/data/fswalk');
        let entries = [
            'test/data/fswalk/a',
            'test/data/fswalk/a/Most.stupid.show.ever.s04e02.hdtv.mkv',
            'test/data/fswalk/a/Most.stupid.show.ever.s04e02.hdtv.txt',
            'test/data/fswalk/a/b',
            'test/data/fswalk/a/b/c.txt',
            'test/data/fswalk/a/b/fun.stuff.s01e01.mkv'
        ];

        entries.forEach(entry => {
            expect(files.indexOf(entry)).to.not.equal(-1);
        });
    });

    it('walk() txt', () => {
        let txtRx = /\.txt/;
        return fs.walk('test/data/fswalk', (fname, stats) => txtRx.test(fname))
            .then(files => {
                expect(files.length).to.be.equal(2);
            });
    });

});
