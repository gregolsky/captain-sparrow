describe('Trakt episodes provider', function () {

  var TraktEpisodesProvider = require('../lib/diyvod/tv/traktEpisodesProvider');

  it('maps trakt json properly', function () {

    var provider = new TraktEpisodesProvider(null, null); 
    var results = provider.mapResults(JSON.parse(getJsonSample()));

    expect(results).toBeDefined();
    expect(results.length).toBe(1);

    var episode = results[0];
    expect(episode).toBeDefined();
    expect(episode.show).toBe('Boardwalk Empire');
    expect(episode.title).toBe('Resignation');
    expect(episode.number).toBe(2);
    expect(episode.season).toBe(4);
    expect(episode.getEpisodeNumber()).toBeDefined();
  });

  function getJsonSample () {
    return '[{"date":"2013-09-15","episodes":[{"show":{"title":"Boardwalk Empire","year":2010,"url":"http://trakt.tv/show/boardwalk-empire","first_aired":1284955200,"first_aired_iso":"2010-09-19T21:00:00-05:00","first_aired_localized":1284955200,"first_aired_utc":1284973200,"country":"United States","overview":"Boardwalk Empire is a period drama focusing on Enoch Nucky Thompson (based on the historical Enoch L. Johnson), a political figure who rose to prominence and controlled Atlantic City, New Jersey, during the Prohibition period of the 1920s and 1930s. Nucky interacts with several historical figures in both his personal and political life, including mobsters, politicians, government agents, and the common folk who look up to him. The federal government also takes an interest in the bootlegging and other illegal activities in the area, sending agents to investigate possible mob connections but also looking at Nucky\'s lifestyle—expensive and lavish for a county political figure.","runtime":60,"network":"HBO","air_day":"Sunday","air_day_localized":"Sunday","air_day_utc":"Monday","air_time":"9:00pm","air_time_localized":"9:00pm","air_time_utc":"2:00am","certification":"TV-MA","imdb_id":"tt0979432","tvdb_id":84947,"tvrage_id":23561,"images":{"poster":"http://slurm.trakt.us/images/posters/121.9.jpg","fanart":"http://slurm.trakt.us/images/fanart/121.9.jpg","banner":"http://slurm.trakt.us/images/banners/121.9.jpg"},"ratings":{"percentage":90,"votes":2824,"loved":2741,"hated":83},"genres":["Drama"],"rating":false,"rating_advanced":0,"in_watchlist":false},"episode":{"season":4,"number":2,"title":"Resignation","overview":"Now working as a delivery man for Dean O’Banion, Van Alden is ordered to keep tabs on Al Capone, joining the ascendant mobster to help keep Cicero voters “informed” at a political rally. Dr. Valentin Narcisse arrives in Atlantic City, clashing with Chalky and Nucky over the loss of an employee. In Washington, Agent Knox aligns himself with J. Edgar Hoover, acting director of the Bureau of Investigation. Harrow fails to finish a job in Milwaukee, while Eddie demands a promotion after 11 years of service. With a business opportunity on the horizon, Nucky departs for Florida.","url":"http://trakt.tv/show/boardwalk-empire/season/4/episode/2","first_aired":1379304000,"first_aired_iso":"2013-09-15T21:00:00-05:00","first_aired_localized":1379304000,"first_aired_utc":1379322000,"images":{"screen":"http://slurm.trakt.us/images/fanart/121-940.9.jpg"},"ratings":{"percentage":90,"votes":3,"loved":3,"hated":0},"rating":false,"rating_advanced":0,"in_watchlist":false,"plays":0,"watched":false,"in_collection":false}}]}]';
  }

});
