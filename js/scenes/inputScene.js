(function () {
  "use strict";
  var _inited;

  window.App.scenes.input = {
    init: function () {
      this.$el = $(".js-scene-input");

      this.$el
        .find(".search-input")
        .on("change", function () {
         console.log(this.value);
        })
        .SBInput({
          keyboard: {
            type: "fulltext_ru_nums",
          },
        });

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
  };
})();
