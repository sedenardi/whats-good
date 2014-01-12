var scLinks = [
  'https://soundcloud.com/flightfacilities/flight-facilities-clair-de-1',
  'https://soundcloud.com/zimmermusic/moullinex-to-be-clear',
  'https://soundcloud.com/isaac-tichauer/angie-stone-i-wish-i-didnt-2'
];
var scIndex = 0, scSound = null, scTitle = '';
/*var ytLinks = [
  'http://www.youtube.com/watch?v=Ir-mZaTAxRU',
  'http://www.youtube.com/watch?v=34OLu1BT0NE',
  'http://www.youtube.com/watch?v=OIiXy98AZ4M'
];
var ytIndex = 0, ytPlayer = null;*/
var client_id, audio5js, player, paused = false;
$( document ).ready(function() {
  client_id = $('#sc_client_id').val();
  SC.initialize({
    client_id: client_id
  });

  audio5js = new Audio5js({
    swf_path: 'audio5js.swf',
    throw_errors: true,
    ready: function() {
      $('#sm_status').html('Ready');
      player = this;

      player.on('canplay', function() {
        $('#sc_title').html(scTitle);
        player.play();
      });
      this.on('play', function () {
        console.log('play');
        paused = false;
      }, this);
      this.on('pause', function () {
        console.log('pause');
        paused = true;
      }, this);
      this.on('ended', function () {
        console.log('ended');
        paused = false;
      }, this);

      // timeupdate event passes audio
      // duration and position to callback
      this.on('timeupdate', function (position, duration) {
        console.log(duration, position);
      }, this);

      // progress event passes load_percent to callback
      this.on('progress', function (load_percent) {
        console.log(load_percent);
      }, this);

      //error event passes error object to callback
      this.on('error', function (error) {
        console.log(error.message);
      }, this);
    }
  })

  $('#sc_start').click(function() {
    if (paused) {
      player.play();
    } else {
      playSCLink(scLinks[scIndex]);
    }
  });

  $('#sc_stop').click(function() {
    stopSC();
  });

  $('#sc_next').click(function() {
    scIndex = scIndex === (scLinks.length - 1) ? 0 : (scIndex + 1);
    stopSC();
    playSCLink(scLinks[scIndex]);
  });

  /*$('#yt_start').click(function() {
    playYTLink(ytLinks[ytIndex]);
  });

  $('#yt_stop').click(function() {
    stopYT();
  });

  $('#yt_next').click(function() {
    ytIndex = ytIndex === (ytLinks.length - 1) ? 0 : (ytIndex + 1);
    playYTLink(ytLinks[ytIndex]);
  });*/
});

var stopSC = function() {
  if (player.playing) {
    player.pause();
  }
};

var playSCLink = function(url) {
  resolveSCLink(url, function(stream_url) {
    if (player.playing) {
      player.pause();
    }
    player.load(stream_url);
  });
};

var resolveSCLink = function(url, callback) {
  console.log('Resolving url: ' + url);
  $('#sc_title').html('Resolving url: ' + url);
  SC.get('/resolve', { url: url }, function(track) {
    console.log('Resolved url to: ' + track.stream_url);
    scTitle = track.title;
    $('#sc_title').html('(Starting...) ' + scTitle);
    callback(track.stream_url + '?client_id=' + client_id);
  });
};

/*var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {

}

var playYTLink = function(url) {
  var vidId = url.split('v=')[1];
  if (ytPlayer === null) {
    ytPlayer = new YT.Player('yt_player', {
      height: '35',
      width: '300',
      videoId: vidId,
      events: {
        'onReady': function(event) {
          //event.target.playVideo();
        },
        'onStateChange': function(event) {
          if (event.data == YT.PlayerState.PLAYING) {
            
          }
        }
      }
    });
  } else {
    ytPlayer.loadVideoById({ videoId: vidId });
  }  
}

var stopYT = function() {
  if (ytPlayer !== null) {
    ytPlayer.stopVideo();
  }
};*/