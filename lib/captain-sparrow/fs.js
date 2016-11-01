import promisify from 'promisify-function';
import * as fs from 'fs';
import * as path from 'path';

export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);

export const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

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
