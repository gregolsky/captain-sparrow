'use strict';

import request from 'request-promise-native';
import fs from 'captain-sparrow/fs';

export default class FileDownloader {
    download (url, path) {
        return request(url)
        .then(content => fs.writeFileAsync(path, content));
    }
}
