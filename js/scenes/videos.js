(function () {
  "use strict";
  var _inited;
  _.templateSettings.interpolate = /\{\{([\s\S]+?)\}\}/g;

  const APIANIMEVIDEO_TOKEN = "a88d97e1788ae00830c4665ab33b7f87";

  var itemHtml = _.template(
    '<div data-url="{{url}}" data-type="{{type}}" class="movieitem video-item nav-item">{{title}}</div>'
  );

  window.App.scenes.video = {
    init: function () {
      this.$el = $(".js-scene-video");

      this.$el.on("click", ".video-item", this.onItemClick);

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
    /* "https://a54t.bazonserver.site/manifest/22655/2160.mp4/index.m3u8?hash=bwIIa3zdRMQAyWs9noh5PQ&expires=1680659139&id=22655&name=2160.mp4" */
    // handler for click event
    onItemClick: function (e) {
      /* const fetchDataAnimeVideo = fetch(
        `https://bazon.cc/api/playlist?token=${APIANIMEVIDEO_TOKEN}&kp=${e.currentTarget.getAttribute(
          "id"
        )}`
      ).then((response) => {
        return response.json();
      }); */
      /* ${results.results[0].playlists[
              Object.keys(results.results[0].playlists)[
                Object.keys(results.results[0].playlists).length - 1
              ]
            ]} */
      function showAnime() {
        try {
          /* const results = await fetchDataAnimeVideo; */
          let animeItem = {
            title: "video",
            url: `https://rr3---sn-4g5ednld.googlevideo.com/videoplayback?expire=1680638632&ei=SC4sZNTPFcuP8gPd_ZaoDA&ip=91.90.122.4&id=o-APO-kqb_TTkOjQoB9sU5Uu_E9gJjomRjH4xRdCzGuQP9&itag=22&source=youtube&requiressl=yes&mh=aB&mm=31%2C29&mn=sn-4g5ednld%2Csn-4g5e6nsk&ms=au%2Crdu&mv=m&mvi=3&pl=24&initcwndbps=522500&spc=99c5CfqOkiwJGHj09cYHFra-4KCLtcGnbq8wx-S4Lw&vprv=1&mime=video%2Fmp4&ns=sx6uDzNOqYk-tk8jksg0aQAM&cnr=14&ratebypass=yes&dur=155.829&lmt=1655331954967271&mt=1680616641&fvip=2&fexp=24007246&c=WEB&txp=4532434&n=zJaY64LtGru3CQ&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIgVueRLgqB_Yk4Anr-CYEKqU9hZBqg52feKhU-mbKJqakCIQDIv5M8WZhSka4QmOOyM_C_6e4n-iPxUKGRt5-wrCZd4Q%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIgQVTQRKbNP0idMOdqdQ_Ji7B1-eZ_TV_80cRhZywKJ6UCIQCgJb6t1zfVDNIj-BY7OkFrV5a7La623cgSjaIF4pGuBw%3D%3D&title=JavaScript%20in%20100%20Seconds`,
            type: "vod",
          };

          console.log('items',animeItem);
           Player.play({
             url: animeItem.url,
             type: animeItem.type,
           });
        } catch (error) {
          console.error(error);
        }
      }
      showAnime();

    },

    // showing items from videos.js
    renderItems: function (items) {
      var html = "";
      console.log('renderItems', items)

      // console.log(items, itemHtml.toString())
      for (var i = 0, len = items.length; i < len; i++) {
        html += itemHtml(items[i]);
      }

      this.$el.empty().html(html);
    },
  };
})();
