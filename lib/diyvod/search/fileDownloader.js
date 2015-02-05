module.exports = FileDownloader;

var http = require('q-io/http'),
moment = require('moment'),
_ = require('lodash'),
zlib = require('zlib'),
q = require('q');

function FileDownloader(fileManager) {
    this.fileManager = fileManager;
}

FileDownloader.prototype.download = download;

function download(url, path) {
    var self = this;
    return http.request(url)
    .then(function (response) {
        if (response.status == 302) {
            return http.request(response.headers.location);
        }

        return response;
    })
    .then(function (response) {
        return response.body.read()
        .then(function (content) {
            if (response.headers['content-encoding'].indexOf('gzip') != -1) {
                return gunzip(content);
            }

            return content;
        });
    })
    .then(function (content) {
        return self.fileManager.write(path, content);
    });
}

function gunzip(gzipped) {
    var deferred = q.defer();

    zlib.gunzip(gzipped, function (err, unzipped) {
        if (err) {
            deferred.reject(err);
            return;
        }

        deferred.resolve(unzipped);
    });

    return deferred.promise;
}
