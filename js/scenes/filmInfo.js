(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\{\{([\s\S]+?)\}\}/g;
    // в конце переменной скрипт для перехода на страницу с сезонами и сериями
  var filmPageHtml = _.template('<div id="{{filmPageId}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><div class="poster_blockImg" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;"></div><div class="film-dscrtn"><div><p class="actors">Актеры: {{actors}}</p><p>Страна: {{country}}</p><p>Год:{{created}}</p><p>Режиссер:{{director}}</p></div><h2 id="videotitle">{{title}}</h2></div></div><p class="description">{{text}}</p></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo"><img width="250" height="70" src="./images/UconCinemaLogo.png" alt="logoimg"></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><img width="30" src="./images/arrowBack.svg" alt="arrow" /> Назад</li><li class="menu-item nav-item watchBtn" id="{{id}}"><h4>Смотреть</h4></li></ul></nav></div></div></div><script>var watchBtn = document.getElementById("{{id}}");  if("{{status}}" === "film") {watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeIdCompilations={{id}}"; $("#waitPopup_bg").show();$$nav.off()})} else {watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeIdCompilations={{id}}"});}</script>');
  
  // создание сцены с информацией о фильме
  window.App.scenes.filmInfo = {
    init: function () {
      this.$el = $(".js-scene-filmInfo");
      this.$el.on("click", ".back", this.onItemBackClick)
      
       
      this.renderItems(App.filmInfo);
      _inited = true;
    },
      onItemBackClick: function (e) {
      var scene = e.currentTarget.getAttribute("data-content");
     $(".header").show();
      window.App.showContent(scene); // показ сцены с постерами
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
    