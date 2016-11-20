'use strict';

import * as fs from 'captain-sparrow/fs';

var expandUserDir = require('expand-home-dir');
const CONFIG_FILE_PATH = expandUserDir('~/.captain-sparrow');

export function loadOrCreate (configFilePath) {
debugger;
    configFilePath = configFilePath || CONFIG_FILE_PATH;

    return fs.exists(configFilePath)
    .then(fileExists => {
        if (!fileExists) {
            return fs.writeFile(
                configFilePath,
                JSON.stringify(defaults(), null, 2))
            .then(() => {
                throw new Error('Configuration is incomplete. Fill in your ~/.captain-sparrow.');
            });
        }

        return fs.readFile(configFilePath, 'utf8');
    })
    .then(json => JSON.parse(json));
}

function defaults () {
    return {
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
        search: {},
        notifications: {
            pushbulletApiKey: ''
        }
    };
}
