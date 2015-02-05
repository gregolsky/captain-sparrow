describe('TV shows library', function () {

  var fs = require('q-io/fs');
  var MockFs = require('q-io/fs-mock');
  var mockFs = MockFs({
    "root": {
      "a": {
        "b": {
          "c.txt": "Content of a/b/c.txt",
          "fun.stuff.s01e01.mkv": 'asdg'
        },
        "Most.stupid.show.ever.s04e02.hdtv.mkv": 'asdg'
      }
    }
  });

  var Episode = include('tv/episode');

  var TvShowsLibrary = include('tv/library');

  it('initializes library from directory', function(done) {

    var library = new TvShowsLibrary({ tv: { libraryPath: "root/a" } }, mockFs); 
    library.initialize()
    .then(function () {
      should.exist(library.files.length);
      library.files.length.should.equal(2);
      done();
    });;
  });

  it('can check if episode is already in', function(done) {
    //function Episode(show, number, season, title, airtime, runtime) {

    var episode = new Episode('Most stupid show  ever', '02', '04', '', null, null);
    var library = new TvShowsLibrary({ tv: { libraryPath: "root/a" } }, mockFs); 

    library.initialize()
    .then(function () {
      var episodeInLibrary = library.contains(episode);
      episodeInLibrary.should.be.true();
      done();
    });
  });

});
