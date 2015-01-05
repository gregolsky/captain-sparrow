
module.exports = TvShowsLibrary;

var _ = require('lodash');
var VIDEO_FILETYPES = [ '.mkv', '.mp4', '.avi' ];

function TvShowsLibrary(settings, fileManager) {
  this.settings = settings;
  this.fileManager = fileManager;
  this.files = null;
}

TvShowsLibrary.prototype.initialize = function () {
  var self = this;
  return self.fileManager.list(self.settings.tv.libraryPath, self.filterFile.bind(self))
    .then(function (files) {
      self.files = _.map(files, function (f) {
        return self.fileManager.base(f);
      });
    });
}

TvShowsLibrary.prototype.contains = function (episode) {
  var self = this;
  console.log(self.files);
  return _.some(self.files, function (filename) {
    return episode.isMatch(filename);
  });

}

TvShowsLibrary.prototype.filterFile = function (path, stat) {
  return stat.isFile() &&
    _.some(VIDEO_FILETYPES, this.fileManager.extension(path));
}
