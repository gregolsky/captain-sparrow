'use strict';

var moment = require('moment');

describe('TvMaze mapper', () => {

    var mapper = include('tvmaze/mapper');
    var Episode = include('tv/episode');
    var data = [{
        'id': 1,
        'url': 'http://www.tvmaze.com/episodes/1/under-the-dome-1x01-pilot',
        'name': 'Pilot',
        'season': 1,
        'number': 1,
        'airdate': '2013-06-24',
        'airtime': '22:00',
        'airstamp': '2013-06-24T22:00:00-04:00',
        'runtime': 60,
        'image': {
            'medium': 'http://tvmazecdn.com/uploads/images/medium_landscape/1/4388.jpg',
            'original': 'http://tvmazecdn.com/uploads/images/original_untouched/1/4388.jpg'
        },
        'summary': "<p>When the residents of Chester's Mill find themselves trapped under a massive transparent dome with no way out, they struggle to survive as resources rapidly dwindle and panic quickly escalates.</p>",
        '_links': {
            'self': {
                'href': 'http://api.tvmaze.com/episodes/1'
            }
        }
    }, {
        'id': 2,
        'url': 'http://www.tvmaze.com/episodes/2/under-the-dome-1x02-the-fire',
        'name': 'The Fire',
        'season': 1,
        'number': 2,
        'airdate': '2013-07-01',
        'airtime': '22:00',
        'airstamp': '2013-07-01T22:00:00-04:00',
        'runtime': 60,
        'image': {
            'medium': 'http://tvmazecdn.com/uploads/images/medium_landscape/1/4389.jpg',
            'original': 'http://tvmazecdn.com/uploads/images/original_untouched/1/4389.jpg'
        },
        'summary': "<p>While the residents of Chester's Mill face the uncertainty of life in the dome, panic is heightened when a house goes up in flames and their fire department is outside of the dome.</p>",
        '_links': {
            'self': {
                'href': 'http://api.tvmaze.com/episodes/2'
            }
        }
    }, {
        'id': 3,
        'url': 'http://www.tvmaze.com/episodes/3/under-the-dome-1x03-manhunt',
        'name': 'Manhunt',
        'season': 1,
        'number': 3,
        'airdate': '2013-07-08',
        'airtime': '22:00',
        'airstamp': '2013-07-08T22:00:00-04:00',
        'runtime': 60,
        'image': {
            'medium': 'http://tvmazecdn.com/uploads/images/medium_landscape/1/4390.jpg',
            'original': 'http://tvmazecdn.com/uploads/images/original_untouched/1/4390.jpg'
        },
        'summary': '<p>When a former deputy goes rogue, Big Jim recruits Barbie to join the manhunt to keep the town safe. Meanwhile, Junior is determined to escape the dome by going underground.</p>',
        '_links': {
            'self': {
                'href': 'http://api.tvmaze.com/episodes/3'
            }
        }
    }];
    var showInfo = {
        'id': 1,
        'url': 'http://www.tvmaze.com/shows/1/under-the-dome',
        'name': 'Under the Dome',
        'type': 'Scripted',
        'language': 'English',
        'genres': ['Drama', 'Science-Fiction', 'Thriller'],
        'status': 'Ended',
        'runtime': 60,
        'premiered': '2013-06-24',
        'schedule': {
            'time': '22:00',
            'days': ['Thursday']
        },
        'rating': {
            'average': 7.4
        },
        'weight': 3,
        'network': {
            'id': 2,
            'name': 'CBS',
            'country': {
                'name': 'United States',
                'code': 'US',
                'timezone': 'America/New_York'
            }
        },
        'webChannel': null,
        'externals': {
            'tvrage': 25988,
            'thetvdb': 264492
        },
        'image': {
            'medium': 'http://tvmazecdn.com/uploads/images/medium_portrait/0/1.jpg',
            'original': 'http://tvmazecdn.com/uploads/images/original_untouched/0/1.jpg'
        },
        'summary': "<p>Under the Dome is the story of a small town that is suddenly and inexplicably sealed off from the rest of the world by an enormous transparent dome. The town's inhabitants must deal with surviving the post-apocalyptic conditions while searching for answers about the dome, where it came from and if and when it will go away.</p>",
        'updated': 1443689700,
        '_links': {
            'self': {
                'href': 'http://api.tvmaze.com/shows/1'
            },
            'previousepisode': {
                'href': 'http://api.tvmaze.com/episodes/185054'
            }
        }
    };

    describe('mapEpisodes', () => {

        describe('maps episodes properly', () => {

            var result, episode;

            beforeEach(() => {
                result = mapper.mapEpisodes(showInfo, data);
                episode = result[0];
            });

            it('is array of Episode', () => {
                expect(result[0])
                .to.be.an.instanceof(Episode);
            });

            it('all fields ok', () => {
                expect(episode.show)
                .to.equal('Under the Dome');
                expect(episode.number)
                .to.equal(1);
                expect(episode.getEpisodeNumber())
                .to.equal('S01E01');
                expect(episode.title)
                .to.equal('Pilot');

                var airtime = moment('2013-06-24T22:00:00-04:00')
                .toDate();
                episode.airtime.toString()
                .should.equal(airtime.toString());
                episode.runtime.should.equal(60);
            });

        });

    });

});
