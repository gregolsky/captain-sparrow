'use strict';

import * as fs from 'captain-sparrow/fs';

var expandUserDir = require('expand-home-dir');
const CONFIG_FILE_PATH = expandUserDir('~/.captain-sparrow');

export async function loadOrCreate (configFilePath) {
    configFilePath = configFilePath || CONFIG_FILE_PATH;

    const fileExists = await fs.exists(configFilePath)
    if (!fileExists) {
        await fs.writeFile(
                configFilePath,
                JSON.stringify(defaults(), null, 2));
        throw new Error('Configuration is incomplete. Fill in your ~/.captain-sparrow.');
    }

    const json = await fs.readFile(configFilePath, 'utf8');
    return JSON.parse(json);
}

function defaults () {
    return {
        searchServices: [],
        shows: [],
        tvmaze: {
            cache: {
                file: '',
                operations: [ 'search', 'showInfo', 'episodeList' ],
                ttl: {
                    search: 30,
                    showInfo: 30,
                    episodeList: 7
                }
            }
        },
        transmission: {
            host: 'localhost',
            port: '9091'
        },
        tv: {
            searchSuffix: '',
            hoursAfterAirTime: 4,
            libraryPath: '',
            downloadDirectory: ''
        },
        calendar: {
            file: ''
        },
        subs: {
            command: 'qnapi',
            commandArgs: [ '-c' ]
        },
        search: {
        },
        notifications: {
            pushbulletApiKey: ''
        }
    };
}
