(function () {
  "use strict";

  window.App = {
    currentScene: null,
    scenes: {},
    isShown: true,

    initialize: function () {
      this.$wrap = $(".wrap");

      $$legend.show();

      this.setEvents();

      // start navigation
      $$nav.on();
    },

    setEvents: function () {
      stb.InitPlayer();
      var url = ''
      $$log(url)
      function playVideo() {
          try {
            stb = gSTB;
    stb.InitPlayer();
    var player = stbPlayerManager.list[0];
    
    gSTB.SetTopWin(0);
    player.aspectConversion = 4;
    player.videoWindowMode = 0;
    player.setViewport({x: 0, y: 500, width: 800, height: 600});
    
    player.play({
        uri: url,
        solution: 'auto'
    });
    
    window.addEventListener('keydown', function ( event ) {
        switch ( event.keyCode ) {
            case 107:
                console.log('keydown: volume up');
                player.volume++;
                break;
            case 109:
                console.log('keydown: volume down');
                player.volume--;
                break;
            case 83:
                if ( event.altKey ) {
                    console.log('keydown: stop');
                    player.stop();
                }
                break;
        }
    });
          } catch (error) {
            $$log(error);
            console.error(error)
          }
      }
      setTimeout(() => playVideo(), 2000)
      $(document.body).on({
        // on keyboard 'd' by default
        "nav_key:blue": _.bind(this.toggleView, this),

        // remote events
        "nav_key:stop": function () {
          Player.stop();
        },
        "nav_key:pause": function () {
          Player.togglePause();
        },
        "nav_key:exit": function () {
          SB.exit();
        },
      });

      // toggling background when player start/stop
      Player.on("ready", function () {
        $$log("player ready");
      });
      Player.on("stop", function () {
        $$log("player stop");
      });
    },

    toggleView: function () {
      if (this.isShown) {
        this.$wrap.hide();
        $$legend.hide();
      } else {
        this.$wrap.show();
        $$legend.show();
      }
      this.isShown = !this.isShown;
    },

    showContent: function (scene) {
      var cur = this.currentScene,
        newScene = this.scenes[scene];

      if (cur !== newScene) {
        if (!newScene) {
          $$error("Scene " + scene + " doesn't exist");
        } else {
          if (cur) {
            cur.hide();
          }
          newScene.show();
          this.currentScene = newScene;
        }
      }
    },
  };

  // main app initialize when smartbox ready
  SB(_.bind(App.initialize, App));
})();
