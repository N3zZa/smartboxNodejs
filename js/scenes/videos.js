(function () {
  "use strict";
  var _inited;
  _.templateSettings.interpolate = /\{\{([\s\S]+?)\}\}/g;

  const APIANIMEVIDEO_TOKEN = "a88d97e1788ae00830c4665ab33b7f87";

  let itemHtml
  const APIANIME_TOKEN = "tiZIrLKGr6cEDt2zQekNOTQyB3uVNscj";
  let APIANIME_URL = `https://videocdn.tv/api/animes?api_token=${APIANIME_TOKEN}`;

  const fetchDataAnime = fetch(APIANIME_URL).then((response) => {
    return response.json();
  });

  const showAnime = async () => {
    try {
      const commits = await fetchDataAnime;
      
      let items = commits.data.map(
        (element) =>
          (itemHtml = _.template(`
          <div id='${element.kinopoisk_id}' class='movieitem navigation-item nav-item video-item' data-url="{{url}}" data-type="{{type}}">
          <img id='imglogo' src='https://kinopoiskapiunofficial.tech/images/posters/kp/${element.kinopoisk_id}.jpg' />
          <h4>${element.ru_title}</h4>
          <p>${element.created}</p>
          </div>

      `))
      );
      return items;
    } catch (error) {
      console.error(error);
    }
  };

  window.App.videos = [];

let animeItems = [
  {
    title: "video",
  url: `https://rr3---sn-4g5ednld.googlevideo.com/videoplayback?expire=1680638632&ei=SC4sZNTPFcuP8gPd_ZaoDA&ip=91.90.122.4&id=o-APO-kqb_TTkOjQoB9sU5Uu_E9gJjomRjH4xRdCzGuQP9&itag=22&source=youtube&requiressl=yes&mh=aB&mm=31%2C29&mn=sn-4g5ednld%2Csn-4g5e6nsk&ms=au%2Crdu&mv=m&mvi=3&pl=24&initcwndbps=522500&spc=99c5CfqOkiwJGHj09cYHFra-4KCLtcGnbq8wx-S4Lw&vprv=1&mime=video%2Fmp4&ns=sx6uDzNOqYk-tk8jksg0aQAM&cnr=14&ratebypass=yes&dur=155.829&lmt=1655331954967271&mt=1680616641&fvip=2&fexp=24007246&c=WEB&txp=4532434&n=zJaY64LtGru3CQ&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIgVueRLgqB_Yk4Anr-CYEKqU9hZBqg52feKhU-mbKJqakCIQDIv5M8WZhSka4QmOOyM_C_6e4n-iPxUKGRt5-wrCZd4Q%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIgQVTQRKbNP0idMOdqdQ_Ji7B1-eZ_TV_80cRhZywKJ6UCIQCgJb6t1zfVDNIj-BY7OkFrV5a7La623cgSjaIF4pGuBw%3D%3D&title=JavaScript%20in%20100%20Seconds`,
  type: "vod",
  },
  {
   title: "video",
  url: `https://du.sf-converter.com/go?payload=1*eJzVU8lu40YQ%2FRXDwPQplLkvBogBSVG7TFOLZesicBPZEpukuEoK8g85B8ghQIIk13xZPiFF2sk4QC6TXDKA6nWroKrqV0%2Fv69sirXIvWOfx7f1tVJZZcX931zRN75JWZeUGPS8ld41TetHHWm2Egkk2fb8KX26%2Feqsc%2B59d6FQ%2BTv8%2BMc95iqKKhMqEUyEl10svTNMwDmrsB2nXqrtlsXNxHe%2F4MThnOA9URpRpkZckmkMBVkvGLLazEa3zh1Rultdw1g%2F1EOFMZRmxx3BMj6GFHiPQCPtqSmma8tBIgs3n26Ew2x8ia1lOtnmfJi%2FrPHSqw%2FNAMG3Gnj5qGOHSCVWGp9Era%2FWNJcqDUwUvKYpYvQQFIpE6XyNCVI75wBqsiEiivmMFOfhWh6ciT4IrIoXqVJBLkxyRWiUAWOVRFqssj3CCS69JfDcrYLDESfDuIvNURfEEw3YlX7JWbL4qsk3ySJGpUU8EmejjwW6yyJLdeVME5XMYZOI8RHWW1yqDCCaB2i3%2FAzsgGY%2BSQi0xFkdMHIup7OoZQ2K%2B3o9m2hyFOO8YeXGQqLws8LwoIr%2FKVVZRegoto5iUsH9J4mSGEeB1HMdJqMuBJqwgiTLa17B7Dh2DIHNiXAddwz1oB%2FxoWmJ5EXnqxtRRCSmRZRgWeCfqWRofXH%2FxTFKNJCGQdnIHVvWqOawrwAA4a8FvAaRpF9sJA5dPkrTZzANsFwBHuwA4kgIA%2BAG27OAAXoDACMV%2FTiNRW0BaaH9B2hrSNanb8Vnb%2FJ1EUIhDVRtyxu6sNQt7HD5P5HSWCBt3ckhZ0fJnhtdsTmv6fL7UTqqw%2Fp46GGUQTxeyMbb7G2Pgr8RtyPb1l9Fkb%2BmBLiW7qBpGm7E5XJeHkTkV9aM9t%2BwPXB8%2BqBtonWh7IjeLcBxpY412DgK5Pj9qZV8bNszRlaaZY4x9au3Wk6Ssn9bOhhs9CIyGTY2VpOLpKuLLNlyuhtuoOS%2FDeCjr6UzeF04fjxNnaT6tpfV0DuPAt50Fv0jfciJy2hs4ieNBOEi0KNKtSXmuRUXuUAHk4N%2F9pdu8W%2Fvn2hxcKSoy85fNZVZ5b3NW5ASRFyTuP9pc%2FFc2fxXwf2j0ebjha91O7PUoXK05yzepSyRfSLqqE13gA3PPPUxt6zg1j2B0gwxyWm9MbrV1Bu7WLeuRtneVJKtWmTyd8k%2BLcrAxdkzEMv9odBuMPnM5eecpVjWkHuYOp52MZMHQmsUvLxRvH4%2BlmYf9%2FXg0qQQNa4OKOo%2BavZ%2FWC3PYSNUpry8R%2FbDjx4%2FcYLsYXmeWVJgDazJtXgeC1UtcxgH4%2FPfvv%2F0V4ieI7yB%2Ba8%2Bbt%2BQPEL9A%2FAzx441wQ3BSlcFNnKYZdHiVsdDK2%2FtPbv%2FmD2%2Ffx04%3D*1680630363*e822f9c87400a1c9`,
  type: "vod",
  }
]
let animeItem = animeItems.map((item) => {
    return item
})
animeItem.forEach((element) => {
  window.App.videos.push(element);
})
console.log(window.App.videos);

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

          var url = e.currentTarget.getAttribute("data-url");
          Player.play({
            url: url,
            type: e.currentTarget.getAttribute("data-type"),
          });

      
    },

    // showing items from videos.js
    renderItems: async function (items) {
      var html = "";
      const movies = await showAnime();
          for (var j = 0; j < items.length; j++) {
          html += movies[j](items[j]);
        }
      this.$el.empty().html(html);
    },
  };
})();
