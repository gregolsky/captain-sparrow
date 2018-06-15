
const { promisify } = require('util');
const _fs = require('fs');
const path = require('path');

const readdirAsync = promisify(_fs.readdir);
const statAsync = promisify(_fs.stat);
const readFileAsync = promisify(_fs.readFile);
const writeFileAsync = promisify(_fs.writeFile);

async function existsAsync(filepath) {
    try {
        await statAsync(filepath);
        return true;
    } catch (err) {
        if (err.code === 'ENOENT') {
            return false;
        }

        throw err;
    }
}

async function walk(dir, filter) {
    const files = await readdirAsync(dir);
    const filesPromises = files.map(async f => {
        const filepath = path.join(dir, f);
        const stats = await statAsync(filepath);
        if (stats.isDirectory()) {
            const x = await walk(filepath, filter);
            if (filter && !filter(filepath, stats)) {
                return x;
            }

            return [filepath, ...x];
        }

        if (filter && !filter(filepath, stats)) {
            return [];
        }

        return filepath;
    });

    const filesLists = await Promise.all(filesPromises);
    return filesLists.reduce((result, arr) => result.concat(arr), []);
}

module.exports = {
    walk,
    readdirAsync,
    existsAsync,
    statAsync,
    readFileAsync,
    writeFileAsync
};
