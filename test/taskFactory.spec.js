const sinon = require('sinon');

describe('Task factory', function () {

    const fakeSettings = {
        trakt: {
            apiKey: '',
            username: ''
        },
        tvmaze: {
            apiKey: '',
            shows: [],
            cache: {
                file: 'test',
                operations: [ 'search', 'showInfo', 'episodeList' ],
                ttl: {
                    search: 30,
                    showInfo: 30,
                    episodeList: 7
                }
            }
        },
        transmission: {
            host: 'host',
            port: '9092'
        },
        tv: {
            searchSuffix: '',
            hoursAfterAirTime: 4,
            libraryPath: '.',
            downloadDirectory: ''
        },
        notifications: {
            pushbulletApiKey: 'baba'
        },
        subs: {
            command: 'test'
        }
    };

    let taskFactory;

    useMockery(beforeEach, afterEach, () => ({
        'captain-sparrow/cache': function () {
            this.attach = sinon.spy();
        }
    }));

    beforeEach(function () {
        this.timeout(10000);
        taskFactory = require('captain-sparrow/taskFactory');
    });

    it('resolves dependencies for tv shows download task', function () {
        return taskFactory.resolve('tv', fakeSettings)
        .then(function (task) {
            expect(task).to.not.be.undefined();
            expect(task.execute).to.not.be.undefined();
            expect(task.settings.transmission.host)
                .to.equal(fakeSettings.transmission.host);
            expect(task.episodeDownloader.downloadClient.settings.host)
                .to.equal(fakeSettings.transmission.host);
        });
    });

    it('resolves dependencies for subs task', function () {

        return taskFactory.resolve('subs', fakeSettings)
        .then(function (task) {
            expect(task).to.not.be.undefined;
            expect(task.execute).to.not.be.undefined;
        });

    });

});
