var scLinks = [
  'https://soundcloud.com/flightfacilities/flight-facilities-clair-de-1',
  'https://soundcloud.com/zimmermusic/moullinex-to-be-clear',
  'https://soundcloud.com/isaac-tichauer/angie-stone-i-wish-i-didnt-2'
];
var scIndex = 0, scSound = null;
var ytLinks = [
  'http://www.youtube.com/watch?v=Ir-mZaTAxRU',
  'http://www.youtube.com/watch?v=34OLu1BT0NE',
  'http://www.youtube.com/watch?v=OIiXy98AZ4M'
];

$( document ).ready(function() {
  SC.initialize({
    client_id: $('#sc_client_id').val()
  });

  soundManager.setup({
    url: '//cdn.jsdelivr.net/soundmanager2/2.97a.20130512/',
    onready: function() {
      $('#sm_status').html('Ready');
    }
  });

  $('#sc_start').click(function() {
    playSCLink(scLinks[scIndex]);
  });

  $('#sc_stop').click(function() {
    stopSC();
  });

  $('#sc_next').click(function() {
    scIndex = scIndex === (scLinks.length - 1) ? 0 : (scIndex + 1);
    stopSC();
    playSCLink(scLinks[scIndex]);
  });
});

var stopSC = function() {
  if (scSound !== null) {
    scSound.stop();
    scSound = null;
  }
};

var playSCLink = function(url) {
  resolveSCLink(url, function(link) {
    SC.stream(link, {
      autoPlay: true,
      stream: true,
      volume: 100,
      onfinish: function() {
        $('#sc_title').html('Nothing');
      },
      onstop: function() {
        $('#sc_title').html('Nothing');
      }
    }, function(sound) {
      scSound = sound;
      console.log('Playing song');
    });
  });
};

var resolveSCLink = function(url, callback) {
  console.log('Resolving url: ' + url);
  $.ajax({
    url: 'http://api.soundcloud.com/resolve.json',
    type: 'GET',
    dataType: 'JSON',
    data: {
      url: url,
      client_id: $('#sc_client_id').val()
    },
    success: function (response) {
      console.log('Resolved url to: ' + response.stream_url);
      $('#sc_title').html(response.title);
      callback(response.stream_url);
    }
  });
};
