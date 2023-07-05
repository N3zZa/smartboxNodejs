(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\{\{([\s\S]+?)\}\}/g;
 //  в конце переменной скрипт для перехода на страницу с плеером
  var translationItems = _.template('<div id="{{id}}" class="episodeBlock navigation-item nav-item"><h4>{{translation}}</h4></div><script>var selectEpisode{{id}} = document.getElementById("{{id}}"); selectEpisode{{id}}.addEventListener("click", function (event) {document.location.href = "{{playerUrl}}"; $("#waitPopup_bg").show();$$nav.off()});</script>')
  
  // создание сцены с сезонами и сериями
  window.App.scenes.translations = {
    init: function () {
      this.$el = $(".js-scene-translation");
      this.renderItems(App.translations);
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
    renderItems: function (items) {
      var translationshtml = "";
     console.log('items', items)
      for (var i = 0, len = items.length; i < len; i++) {
        translationshtml += translationItems(items[i]);
      }
      this.$el.empty().html(translationshtml);
    },
  };
})();
    