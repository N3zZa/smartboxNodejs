(function () {
  var _inited;
    _.templateSettings.interpolate = /\{\{([\s\S]+?)\}\}/g;
  var filmPageHtml = _.template('<div id="{{filmPageId}}" data-id="{{id}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><img src="{{imgurl}}" alt="posterimg"><div class="film-dscrtn"><div><p class="actors">Актеры: {{actors}}</p><p>Страна: {{country}}</p><p>Год:{{created}}</p><p>Режиссер:{{director}}</p></div><h2>{{title}}</h2></div></div><p class="description">{{text}}</p></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo"><img width="250" height="60" src="./images/UCS.svg" alt="logoimg"></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><img width="30" src="./images/arrowBack.svg" alt="arrow" /> Назад</li><li data-url="{{url}}" class="voiceover menu-item nav-item video-item">Озвучка 1</div></ul></nav></div></div>');
  window.App.scenes.filmInfo = {
    init: function () {
      this.$el = $(".js-scene-filmInfo");
      this.$el.on("click", ".back", this.onItemBackClick)
      this.$el.on("click", ".voiceover", this.onItemClick)
      this.renderItems(App.filmInfo);
      _inited = true;
    },
      onItemBackClick: function (e) {
      var scene = e.currentTarget.getAttribute("data-content");
      $(".header").show();
      window.App.showContent(scene);
    },
    onItemClick: async function (e) {
      var url = e.currentTarget.getAttribute("data-url");
      var results = [];
      async function logJSONData() {
      var response = await fetch("https://bazon.cc/api/playlist?token=a88d97e1788ae00830c4665ab33b7f87&kp=1005878&ref=&ip=178.121.34.101");
      var jsonData = await response.json();
      return jsonData
    }
    var video = await logJSONData();
    var data = video.results[0].playlists[Object.keys(video.results[0].playlists)[2]].toString();
    console.log(data)
    Player.play({
        url: data,
        type: 'm3u8',
      });
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
      var filmhtml = "";
      // console.log(items, itemHtml.toString())
      for (var i = 0, len = items.length; i < len; i++) {
        filmhtml += filmPageHtml(items[i]);
      }
      
      this.$el.empty().html(filmhtml);
    },
  };
})();
    