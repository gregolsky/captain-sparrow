'use strict';

var http = require('q-io/http'),
zlib = require('zlib');

export default class FileDownloader {

    constructor (fileManager) {
        this.fileManager = fileManager;
    }

    download (url, path) {
        return http.request(url)
        .then(response => {
            if (response.status === 302) {
                return http.request(response.headers.location);
            }

            return response;
        })
        .then(response => {
            return response.body.read()
            .then(content => {
                if (response.headers['content-encoding'].indexOf('gzip') !== -1) {
                    return gunzip(content);
                }

                return content;
            });
        })
        .then(content => {
            return this.fileManager.write(path, content);
        });
    }
}

function gunzip (gzipped) {
    return new Promise((resolve, reject) => {
        zlib.gunzip(gzipped, function (err, unzipped) {
            if (err) {
                reject(err);
                return;
            }

            resolve(unzipped);
        });
    });
}
