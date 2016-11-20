import promisify from 'promisify-function';
import * as _fs from 'fs';
import * as path from 'path';

export const readFile = promisify(_fs.readFile);
export const writeFile = promisify(_fs.writeFile);

export const readdir = promisify(_fs.readdir);
const stat = promisify(_fs.stat);
debugger;
const _exists = promisify(_fs.exists);

export function exists(filepath) {
    return stat(filepath)
        .then(() => true)
        .catch(err => {
            if (err.code === 'ENOENT') {
                return false;
            }

            throw err;
        });
}

export function walk (dir, filter) {
    return readdir(dir)
    .then(files => {
        let filesPromises = files.map(f => {
            let filepath = path.join(dir, f);

            return stat(filepath)
                .then(stats => {
                    if (stats.isDirectory()) {
                        return walk(filepath, filter)
                            .then(x => {
                                if (filter && !filter(filepath, stats)) {
                                    return x;
                                }

                                return [ filepath, ...x ]
                            });
                    }

                    if (filter && !filter(filepath, stats)) {
                        return [];
                    }

                    return filepath;
                });
        }, []);

        return Promise.all(filesPromises);
    })
    .then(filesLists => filesLists.reduce((result, arr) => result.concat(arr), []));
}
