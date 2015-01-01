
var _ = require('lodash'),
q = require('q'),
moment = require('moment'),
colors = require('colors');

module.exports = TorrentSearch;

function TorrentSearch(
  settings,
  kickassTorrentProvider) {
    this.settings = settings;
    this.kickassTorrentProvider = kickassTorrentProvider;
  }

  TorrentSearch.prototype.execute = execute;
  TorrentSearch.prototype.outputResults = outputResults;
  TorrentSearch.prototype.formatResultsEntry = formatResultsEntry;

  function execute() {
    var self = this;

    var term = self.settings.search.term;
    if (!term) {
      console.log('Please provide a term for the search');
      return q.when();
    }

    return this.kickassTorrentProvider.search(term)
    .then(function (results) {
      self.outputResults(results);
    });
  }

  function outputResults(results) {
    var self = this;
    if (!results.length) {
      console.log('No results found.');
      return;
    }

    _.each(results, function (entry, i) {
      console.log(self.formatResultsEntry(entry, i));
    });
  }

  function formatResultsEntry(entry, index) {
    var result = '';
    result += (index + 1) + '.\t' + entry.name.bold + '\n';
    result += ('\tS: ' + entry.seeds).green + '\t' + 
      ('L: ' + entry.leechs).red + ' ' +
      '\tSize: ' + formatSize(entry.size).blue + '\tCreated at: ' + moment(entry.createdAt).format('YYYY-MM-DD').yellow  + '\n';
    result += '\t' + entry.torrentLink.gray + '\n'; 

    return result;
  }

  function formatSize(size) {
    return (size /1024/ 1024).toFixed(2) + ' Mb';
  }
