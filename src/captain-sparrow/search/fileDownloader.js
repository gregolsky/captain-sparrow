'use strict';

import request from 'request-promise-native';
import { writeFile } from 'captain-sparrow/fs';

export default class FileDownloader {
    download (url, path) {
        return request(url)
        .then(content => writeFile(path, content));
    }
}
