(function () {
  var _inited;
  _.templateSettings.interpolate = /\{\{([\s\S]+?)\}\}/g;

    var seasonItems = _.template('<div id="{{id}}" data-content="searchedMovie" class="episodeBlock navigation-item nav-item" data-season="{{season}}" data-episode="{{episode}}"><h4>{{season}}</h4><p>{{episode}}</p></div><script>var selectEpisode = document.getElementById("{{id}}"); selectEpisode.addEventListener("click", function (event) {document.location.href = "/getTranslations={{id}}";$("#waitPopup_bg").show();$$nav.off()})</script>')
    
    window.App.scenes.serialSeasons = {
      init: function () {
        this.$el = $(".js-scene-serialSeasons");
        this.renderItems(window.App.searchedMovie);
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
      // showing items from videos.js
      renderItems: function (items) {
        var seasonshtml = "";
        console.log("items", items);
        for (var i = 0, len = items.length; i < len; i++) {
          seasonshtml += seasonItems(items[i]);
        }
        this.$el.empty().html(seasonshtml);
      },
    };
})();
