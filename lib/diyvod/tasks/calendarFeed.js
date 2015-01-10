
module.exports = CreateCalendarFeed;

function CreateCalendarFeed(episodesProvider, episodesExporter) {
  this.episodesProvider = episodesProvider;
  this.episodesExporter = episodesExporter;
}

CreateCalendarFeed.prototype.execute = function () {
  var self = this;
  return self.episodesProvider.getEpisodes()
    .then(function (episodes) {
      return self.episodesExporter.export(episodes);
    })
    .then(function () {
      if (self.onEnd) {
        self.onEnd();
      } 
    });
}

CreateCalendarFeed.prototype.onTaskEnd = function (fun) {
    this.onEnd = fun;
  }
