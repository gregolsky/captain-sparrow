const chalk = require('chalk');
const moment = require('moment');

class TorrentSearch {

    constructor(settings, kickassTorrentProvider, fileDownloader) {
        this.settings = settings;
        this.kickassTorrentProvider = kickassTorrentProvider;
        this.fileDownloader = fileDownloader;
    }

    async execute() {
        var term = this.settings.search.term;
        if (!term) {
            console.log('Please provide a term for the search');
            return Promise.resolve();
        }

        const results = await this.kickassTorrentProvider.search(term);
        if (this.settings.search.save) {
            return this.saveTorrentFile(results);
        }

        this.outputResults(results);
    }

    outputResults(results) {
        if (!results.length) {
            console.log('No results found.');
            return;
        }

        results.forEach((entry, i) => {
            console.log(this.formatResultsEntry(entry, i));
        });
    }

    formatResultsEntry(entry, index) {
        var result = '';
        result += `${ index + 1 }.\t${ chalk.bold(entry.name) } \n`;
        result += chalk.green(`\tS: ${ entry.seeds }\t`) + chalk.red(`L: ${ entry.leechers }`);
        result += `\tSize: ${ chalk.blue(formatSize(entry.size)) }`;
        result += `\tCreated at: ${ chalk.yellow(moment(entry.createdAt).format('YYYY-MM-DD')) }\n`;
        result += `\t ${ chalk.gray(entry.torrentLink) }\n`;

        return result;
    }

    saveTorrentFile(results) {
        var path = this.settings.search.save;
        var index = this.settings.search.index !== undefined
            ? this.settings.search.index - 1
            : 0;

        if (index > results.length - 1 || index < 0) {
            throw new Error('Invalid index argument');
        }

        return this.fileDownloader.download(results[index].torrentLink, path);
    }
}

function formatSize(size) {
    return (size / 1024 / 1024).toFixed(2) + ' Mb';
}

module.exports = TorrentSearch;
