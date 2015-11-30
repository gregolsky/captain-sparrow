module.exports = {
    loadOrCreate: loadOrCreate
};

var expandUserDir = require('expand-home-dir');

function loadOrCreate (fs) {
    var configFilePath = expandUserDir('~/.captain-sparrow');

    return fs.exists(configFilePath)
    .then(function (fileExists) {
        if (!fileExists) {
            return fs.write(configFilePath, JSON.stringify(defaults(), null, '  '))
            .then(function () {
                throw new Error('Configuration is incomplete. Fill in your ~/.captain-sparrow.');
            });
        }

        return fs.read(configFilePath);
    })
    .then(function (json) {
        return JSON.parse(json);
    });
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
