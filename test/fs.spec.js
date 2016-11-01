
describe('fs', () => {

    let fs = require('captain-sparrow/fs');

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
    }))

    it('walk() all', () => {
        return fs.walk('root')
        .then(files => {

            let entries = [ 'root/a',
              'root/a/Most.stupid.show.ever.s04e02.hdtv.mkv',
              'root/a/Most.stupid.show.ever.s04e02.hdtv.txt',
              'root/a/b',
              'root/a/b/c.txt',
              'root/a/b/fun.stuff.s01e01.mkv' ];

              entries.forEach(entry => {
                 expect(files.indexOf(entry)).to.not.equal(-1);
              });
        });
    });

    it('walk() txt', () => {
        let txtRx = /\.txt/;
        return fs.walk('root', (fname, stats) => txtRx.test(fname))
        .then(files => {
            expect(files.length).to.be.equal(2);
        });
    });

});
