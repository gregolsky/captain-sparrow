describe('Normalization util', function() {

    var normalize = require('../src/normalize');

    it('can pad strings', function() {
        var result = normalize.padLeft('S00', 4);
        result.should.equal('S04');
    });

});
