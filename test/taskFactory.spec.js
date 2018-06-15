const sinon = require('sinon');
const rewire = require('rewire');

describe('Task factory', function() {

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
    let revertTaskFactory;

    beforeEach(function() {
        taskFactory = rewire('../src/taskFactory');
        revertTaskFactory = taskFactory.__set__('Cache', function() {
            this.attach = sinon.spy();
        });
    });

    afterEach(function() {
        revertTaskFactory();
    });

    it('resolves dependencies for tv shows download task', async function() {
        const task = await taskFactory.resolve('tv', fakeSettings);
        expect(task).to.not.be.undefined();
        expect(task.execute).to.not.be.undefined();
        expect(task.settings.transmission.host)
            .to.equal(fakeSettings.transmission.host);
        expect(task.episodeDownloader.downloadClient.settings.host)
            .to.equal(fakeSettings.transmission.host);
    });

    it('resolves dependencies for subs task', async function() {
        const task = await taskFactory.resolve('subs', fakeSettings);
        expect(task).to.not.be.undefined();
        expect(task.execute).to.not.be.undefined();
    });

});
