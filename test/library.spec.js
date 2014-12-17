describe('TV shows library', function () {

  var fs = require('q-io/fs');

  it('test', function(done) {

    function guard(path, stat) {
      return stat.isFile() && fs.extension(path) == '.mp4';
    }

    fs.listTree('/net/azazel/Pobrane', guard)
      .then(function (files) {
        console.log(files.join('\r\n'));
        done();
      });

    

  });

});
