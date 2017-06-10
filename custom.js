// dropdown show on hover from https://stackoverflow.com/q/42183672
$('body').on('mouseenter mouseleave', '.dropdown', function(e) {
  var _d = $(e.target).closest('.dropdown');
  _d.addClass('show');
  setTimeout(function() {
    _d[_d.is(':hover') ? 'addClass' : 'removeClass']('show');
  }, 300);
});

$(function() {
  // initialize Bootstrap tooltips
  $('[data-toggle="tooltip"]').tooltip();

  /*
  // initialize Bootstrap carousel
  $('.carousel').carousel({
      interval: 5000 //period
  });
  */

  // swap which portfolio item is shown
  $('#link-1').click(function() {
    $('#item-1').fadeOut('slow', function() {
      $('#item-2').fadeIn('fast');
    });
  });
});

//YouTube code taken from https://stackoverflow.com/a/7988536
function getFrameID(id) {
  var elem = document.getElementById(id);
  if (elem) {
    if (/^iframe$/i.test(elem.tagName)) return id; //Frame, OK
    // else: Look for frame
    var elems = elem.getElementsByTagName("iframe");
    if (!elems.length) return null; //No iframe found, FAILURE
    for (var i = 0; i < elems.length; i++) {
      if (/^https?:\/\/(?:www\.)?youtube(?:-nocookie)?\.com(\/|$)/i.test(elems[i].src)) break;
    }
    elem = elems[i]; //The only, or the best iFrame
    if (elem.id) return elem.id; //Existing ID, return it
    // else: Create a new ID
    do { //Keep postfixing `-frame` until the ID is unique
      id += "-frame";
    } while (document.getElementById(id));
    elem.id = id;
    return id;
  }
  // If no element, return null.
  return null;
}

// Define YT_ready function.
var YT_ready = (function() {
  var onReady_funcs = [],
    api_isReady = false;
  /* @param func function     Function to execute on ready
   * @param func Boolean      If true, all qeued functions are executed
   * @param b_before Boolean  If true, the func will added to the first
                               position in the queue*/
  return function(func, b_before) {
    if (func === true) {
      api_isReady = true;
      while (onReady_funcs.length) {
        // Removes the first func from the array, and execute func
        onReady_funcs.shift()();
      }
    } else if (typeof func == "function") {
      if (api_isReady) func();
      else onReady_funcs[b_before ? "unshift" : "push"](func);
    }
  };
})();
// This function will be called when the API is fully loaded
function onYouTubePlayerAPIReady() {
  YT_ready(true);
}

//callback for state changes in YT video player
function vidStateChange(ev) {
  //if vid player is now playing/buffering/starting, pause the carousel
  if (ev.data == 1 || ev.data == 3 || ev.data == -1) {
    $('#carousel-pictures').carousel('pause');
  }
  //if vid player has been paused or has ended, resume the carousel
  if (ev.data == 2 || ev.data === 0) {
    //NOTE cycling will occur even if user is already hovering over iframe when video pauses
    //   might annoy user if they are trying to modify playback controls after pausing
    $('#carousel-pictures').carousel('cycle');
  }
}

(function() { // Closure, to not leak to the scope
  //reference to YouTube API object
  var vidplayer;

  // Load YouTube Frame API, but only if video iframe is present
  if ($('#youtube-iframe').length > 0) {
    var s = document.createElement("script");
    s.src = (location.protocol == 'https:' ? 'https' : 'http') + "://www.youtube.com/player_api";
    var before = document.getElementsByTagName("script")[0];
    before.parentNode.insertBefore(s, before);

    YT_ready(function() {
      var frameID = getFrameID('youtube-iframe');
      if (frameID) {
        vidplayer = new YT.Player(frameID, {
          events: {
            'onStateChange': vidStateChange
          }
        });
      }
    });
  }

  //if video is playing while carousel slide changes, pause video automatically
  $('#carousel-pictures').on('slide.bs.carousel', function(ev) {
    if (vidplayer) {
      var playerState = vidplayer.getPlayerState();
      if (playerState == 1 || playerState == 3 || playerState == -1) {
        vidplayer.pauseVideo();
      }
    }
  });
})();
