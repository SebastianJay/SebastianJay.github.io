// global mapping of id nums to video players
var gVidPlayers = {}

// This function will be called when the YT API is fully loaded
function onYouTubeIframeAPIReady() {
  $('.youtube-iframe').each(function() {
    var mId = $(this).attr('id').split('-')[1];
    var vidplayer = new YT.Player($(this).attr('id'), {
      events: {
        'onStateChange': vidStateChange
      }
    });
    if (!(mId in gVidPlayers)) {
      gVidPlayers[mId] = [];
    }
    gVidPlayers[mId].push(vidplayer);
  })
}

//callback for state changes in YT video player
function vidStateChange(ev) {
  var mId = $(ev.target.a).attr('id').split('-')[1];
  //if vid player is now playing/buffering/starting, pause the carousel
  if (ev.data == YT.PlayerState.PLAYING || ev.data == YT.PlayerState.BUFFERING || ev.data == -1) {
    $('#carousel-' + mId).carousel('pause');
  }
}

// initialization routines on jQuery load
$(function() {
  // initialize Bootstrap tooltips
  $('[data-toggle="tooltip"]').tooltip();

  // portfolio item switching logic
  var activeId = '-1';
  $('#portfolio-nav .nav-link').not('.dropdown-toggle').each(function() {
    $(this).click(function() {
      var mId = $(this).attr('id').split('-')[1];
      if (mId != activeId) {

        // adjust which links have active class, and adjust carousels
        if (activeId != '-1') {
          $('#link-' + activeId).removeClass('active');
          $('#link-' + activeId).parent().prev().removeClass('active');
          $('#carousel-' + activeId).carousel('pause');
        }
        $('#link-' + mId).addClass('active');
        $('#link-' + mId).parent().prev().addClass('active');
        $('#carousel-' + mId).carousel('cycle');

        // fade to next item
        $(activeId == '-1' ? '#item-default' : '#item-' + activeId).fadeOut('slow', function() {
          $('#item-' + mId).fadeIn('fast');
          activeId = mId;
        });
      }
    });
  });

  // load YouTube Frame API async, only if video iframe is present
  if ($('.youtube-iframe').length > 0) {
    var s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    var before = document.getElementsByTagName("script")[0];
    before.parentNode.insertBefore(s, before);
  }

  $('.carousel').each(function() {
    $(this).on('slide.bs.carousel', function(ev) {
      // if video is playing while carousel slide changes, pause video automatically
      var mId = $(this).attr('id').split('-')[1];
      if (mId in gVidPlayers) {
        for (var i = 0; i < gVidPlayers[mId].length; i+=1) {
          var vidplayer = gVidPlayers[mId][i];
          var playerState = vidplayer.getPlayerState();
          if (playerState == YT.PlayerState.PLAYING || playerState == YT.PlayerState.BUFFERING || playerState == -1) {
            vidplayer.pauseVideo();
          }
        }
      }

      // resume auto cycling on slide movement (if carousel was paused before)
      $(this).carousel('cycle');
    });

    // all carousels are paused initially (as they are hidden)
    $(this).carousel('pause');
  });
});
