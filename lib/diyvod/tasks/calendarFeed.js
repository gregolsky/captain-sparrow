
module.exports = CreateCalendarFeed;

function CreateCalendarFeed(episodesProvider, episodesExporter) {
  this.episodesProvider = episodesProvider;
  this.episodesExporter = episodesExporter;
}

CreateCalendarFeed.prototype.execute = function () {
  var self = this;
  return episodesProvider.getEpisodes()
    .then(function (episodes) {
      return episodesExporter.export(episodes);
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
