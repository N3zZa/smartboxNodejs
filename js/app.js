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
      this.$wrap.show();
      // start navigation
      $$nav.on();
    },

    setEvents: function () {
      var self = this,
        $bg = $(".bg");
      var wrap = this.$wrap;
      self.showContent("video");
      // click on menu item

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
        $bg.hide();
        wrap.hide();
        $$log("player ready");
      });
      Player.on("stop", function () {
        $bg.show();
        wrap.show();
        $$log("player stop");
      });
    },

    toggleView: function () {
      if (this.isShown) {
        this.$wrap.hide();
        $$legend.hide();
      } else {
        this.$wrap.hide();
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
