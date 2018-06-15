import { promisify } from 'util';
import * as _fs from 'fs';
import * as path from 'path';

export const readFile = promisify(_fs.readFile);
export const writeFile = promisify(_fs.writeFile);

export const readdir = promisify(_fs.readdir);
const stat = promisify(_fs.stat);

export async function exists(filepath) {
    try {
        await stat(filepath);
        return true;
    } catch (err) {
        if (err.code === 'ENOENT') {
            return false;
        }

        throw err;
    }
}

export async function walk (dir, filter) {
    const files = await readdir(dir);
    const filesPromises = files.map(async f => {
        const filepath = path.join(dir, f);
        const stats = await stat(filepath);
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
