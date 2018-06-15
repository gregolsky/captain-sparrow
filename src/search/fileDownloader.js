const request = require('request-promise-native');
const { writeFileAsync } = require('../util/fs');

class FileDownloader {
    async download(url, path) {
        const content = await request(url);
        await writeFileAsync(path, content);
    }
}

module.exports = FileDownloader;
