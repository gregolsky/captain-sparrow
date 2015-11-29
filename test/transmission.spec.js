describe('Transmission daemon client', function () {

  var TransmissionClient = include('transmission');

  var settings = {
    transmission: {
      host: '192.168.1.77',
      port: '9091'
    }
  };

  /* Integration test */
  xit('lists torrents in the queue', function (done) {

    var client = new TransmissionClient(settings);
    client.list()
      .then(function (queue) {

        expect(queue).toBeDefined();
        expect(queue.length).toBe(1);

        var torrent = queue[0];
        expect(torrent.name).toBeDefined();
        expect(torrent.downloadDir).toBeDefined();

        done();
      }, function (err) {
        console.error(err);
        done();
      });

  });

  /* Integration test */
  xit('adds a torrent via link to the queue', function (done) {
    var client = new TransmissionClient(settings);
    var link = 'http://releases.ubuntu.com/14.10/ubuntu-14.10-desktop-amd64.iso.torrent';
    var addOptions = {
      'download-dir': '/media/data/'
    };

    client.addUrl(link, addOptions)
      .then(function (arg) {
        expect(arg.id).toBeDefined();
        expect(arg.hashString).toBeDefined();
        expect(arg.name).toBeDefined();
        done();
      });
  });

});
