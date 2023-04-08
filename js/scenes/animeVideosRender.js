(function () {
  var _inited;
    _.templateSettings.interpolate = /\{\{([\s\S]+?)\}\}/g;
  var itemHtml = _.template('<div data-id="{{id}}" class="movieitem navigation-item nav-item video-item" data-url="{{url}}" data-type="{{type}}"><img id="imglogo" src="{{imgurl}}"/><h4>{{title}}</h4><p>{{created}}</p></div>');

  window.App.scenes.video = {
    init: function () {
      this.$el = $(".js-scene-video");

      this.$el.on("click", ".video-item", this.onItemClick);

      this.renderItems(App.videos);

      _inited = true;
    },

    show: function () {
      if (!_inited) {
        this.init();
      }

      this.$el.show();
    },

    hide: function () {
      this.$el.hide();
    },

    // "https://a54t.bazonserver.site/manifest/22655/2160.mp4/index.m3u8?hash=bwIIa3zdRMQAyWs9noh5PQ&expires=1680659139&id=22655&name=2160.mp4"
    // handler for click event
    onItemClick: function (e) {
       var url = e.currentTarget.getAttribute("data-url");
      Player.play({
        url: url,
        type: e.currentTarget.getAttribute("data-type"),
      });
    },

    // showing items from videos.js
    renderItems: function (items) {
      var html = "";

      // console.log(items, itemHtml.toString())
      for (var i = 0, len = items.length; i < len; i++) {
        html += itemHtml(items[i]);
      }

      this.$el.empty().html(html);
    },
  };
})();

    