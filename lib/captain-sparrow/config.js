'use strict';

var expandUserDir = require('expand-home-dir');
const CONFIG_FILE_PATH = expandUserDir('~/.captain-sparrow');

export function loadOrCreate (fs, configFilePath) {
    configFilePath = configFilePath || CONFIG_FILE_PATH;

    return fs.exists(configFilePath)
    .then(fileExists => {
        if (!fileExists) {
            return fs.write(
                configFilePath,
                JSON.stringify(defaults(), null, '  '))
            .then(() => {
                throw new Error('Configuration is incomplete. Fill in your ~/.captain-sparrow.');
            });
        }

        return fs.read(configFilePath);
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
