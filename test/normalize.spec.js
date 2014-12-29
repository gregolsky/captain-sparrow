describe('Normalization util', function () {

  var normalize = require('../lib/diyvod/normalize');

  it('can pad strings', function () {

    var result = normalize.padLeft('S00', 4);
    expect(result).toBe('S04');
    console.log(result);

  });

});
