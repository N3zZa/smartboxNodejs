(function () {
  var _inited;
    _.templateSettings.interpolate = /\{\{([\s\S]+?)\}\}/g;
  var itemHtml = _.template('<div data-content="filmInfo" data-film="{{filmPageId}}" data-id="{{id}}" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;" class="movieitem navigation-item nav-item" data-url="{{url}}" data-type="{{type}}"><h4>{{title}}</h4></div>');
  var filmPageHtml = _.template('<div id="{{filmPageId}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><img src="{{imgurl}}" alt="posterimg"><div class="film-dscrtn"><div><p>Год:{{created}}</p></div><h2>{{title}}</h2></div></div></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo">logoimg<div class="logo_text"><h4>Ucon Cinema</h4><p>Домашний кинотеатр</p></div></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><= Назад</li><li data-url="{{url}}" class="voiceover menu-item nav-item video-item">Озвучка 1</div></ul></nav></div></div>');
    
  window.App.scenes.video = {
    init: function () {
      this.$el = $(".js-scene-video");


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

    