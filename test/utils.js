class FakeFilesystem {

    constructor(files, opts) {
        this._files = files || {};
    }

    get files() {
        return this._files;
    }

    async readFileAsync(fname, enc) {
        const val = this._files[fname];
        if (!val) {
            const err = new Error('FakeFS: File or directory not found.');
            err.code = 'ENOENT';
            throw err;
        }

        return val;
    }

    async writeFileAsync(fname, data, enc) {
        this._files[fname] = data;
    }

    readFile(fname, encOrCb, cb) {
        if (typeof encOrCb === 'function') {
            cb = encOrCb;
            encOrCb = null;
        }

        const val = this._files[fname];
        const result = encOrCb ? val : Buffer.from(val);
        if (!result) {
            const err = new Error('File or directory not found.');
            err.code = 'ENOENT';
            cb(err, null);
            return;
        }

        cb(null, result);
    }

    writeFile(fname, data, optsOrCb, cb) {
        if (typeof optsOrCb === 'function') {
            cb = optsOrCb;
            optsOrCb = null;
        }

        this._files[fname] = data;
        cb(null);
    }

}

module.exports = {
    FakeFilesystem
};
