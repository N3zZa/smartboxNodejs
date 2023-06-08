const express = require("express");
require("dotenv").config(); // Config file
const fetch = require("cross-fetch");
var app = express();
const path = require("path");
var _ = require("lodash");
const fs = require("fs");
app.use(express.static(__dirname));

// API BAZON_TOKEN
const API_TOKEN = process.env.BAZON_TOKEN;

const APIANIME_URL = `https://bazon.cc/api/json?token=${API_TOKEN}&type=all&page=1&cat=аниме`;
const APIFILMS_URL = `https://bazon.cc/api/json?token=${API_TOKEN}&type=film&page=1&cat=фильм`;
const APISERIALS_URL = `https://bazon.cc/api/json?token=${API_TOKEN}&type=serial&page=1`;
const APICARTOONS_URL = `https://bazon.cc/api/json?token=${API_TOKEN}&type=film&page=1&cat=мультфильм`;
const APICOMPILATIONS_URL = `https://bazon.cc/api/json?token=${API_TOKEN}&type=all&page=1`;
const APIPREMIERES_URL = `https://bazon.cc/api/json?token=${API_TOKEN}&type=all&page=1&year=${new Date().getFullYear()}`;
const APISEARCH_URL = `https://bazon.cc/api/search?token=${API_TOKEN}&title=`;

const fetchOptions = {
  agent: new http.Agent({ keepAlive: true }),
  timeout: 500,
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

// ------------------- Функция запрос на python api для получения видеофайлов -----------------------
function getMp4Videos(item, season, episode, url, res) {
  try {
    if (season) {
      const requestData = {
        name: item.info.rus,
        year: item.info.year,
        country: item.info.country,
        season: season,
        episode: episode,
      };
      console.log("rerequestData1", requestData);
      fetch(url, {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((jsonResponse) => {
          const link = jsonResponse.Link.videos;
          const video = link["1080p"];
          const playerPage = `<!DOCTYPE html>
<html lang="">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">
        <script type="text/javascript" src="src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="js/lib/smartbox.js"></script>
        
        
</head>
<style>
body {
  padding: 0;
  margin: 0;
}

</style>
  
<body>
  <div class="wrap">
    
  </div>
  <script type="text/javascript">
      $('html').keyup(function(e){
      if (e.keyCode === 8) {
        window.location='/'
      }
    })  
    var url = '${video.toString()}';
    stb = gSTB;
    stb.InitPlayer();
    var player = stbPlayerManager.list[0];
    
    gSTB.SetTopWin(0);
    player.aspectConversion = 4;
    player.videoWindowMode = 0;
    // player.setViewport({x: 0, y: 500, width: 800, height: 600});
    
    player.play({
        uri: url,
        solution: 'auto'
    });
    
    window.addEventListener('keydown', function ( event ) {
        switch ( event.keyCode ) {
            case 107:
                console.log('keydown: volume up');
                player.volume++;
                break;
            case 109:
                console.log('keydown: volume down');
                player.volume--;
                break;
            case 83:
                if ( event.altKey ) {
                    console.log('keydown: stop');
                    player.stop();
                }
                break;
        }
    });
  </script>
</body>
</html>`;

          res.send(playerPage); // Отправка ответа в виде HTML
        })
        .catch((error) => console.error("getMp4Videos1", error));
    } else {
      const requestData = {
        name: item.info.rus,
        year: item.info.year,
        country: item.info.country,
      };
      console.log("rerequestData2", requestData);
      fetch(url, {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((jsonResponse) => {
          const link = jsonResponse.Link.videos;
          const video = link["1080p"];
          fs.writeFileSync(
            `./js/playVideo.js`,
            `(function () {
  "use strict";

  window.App = {
    currentScene: null,
    scenes: {},
    isShown: true,

    initialize: function () {
      this.$wrap = $(".wrap");

      $$legend.show();

      this.setEvents();

      // start navigation
      $$nav.on();
    },

    setEvents: function () {
      stb.InitPlayer();
      var url = '${video}'
      $$log(url)
     function playVideo() {
          try {
            stb = gSTB;
    stb.InitPlayer();
    var player = stbPlayerManager.list[0];
    
    gSTB.SetTopWin(0);
    player.aspectConversion = 4;
    player.videoWindowMode = 0;
    player.setViewport({x: 0, y: 500, width: 800, height: 600});
    
    player.play({
        uri: url,
        solution: 'auto'
    });
    
    window.addEventListener('keydown', function ( event ) {
        switch ( event.keyCode ) {
            case 107:
                console.log('keydown: volume up');
                player.volume++;
                break;
            case 109:
                console.log('keydown: volume down');
                player.volume--;
                break;
            case 83:
                if ( event.altKey ) {
                    console.log('keydown: stop');
                    player.stop();
                }
                break;
        }
    });
          } catch (error) {
            $$log(error);
            console.error(error)
          }
      }
      setTimeout(() => playVideo(), 2000)
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
        $$log("player ready");
      });
      Player.on("stop", function () {
        $$log("player stop");
      });
    },

    toggleView: function () {
      if (this.isShown) {
        this.$wrap.hide();
        $$legend.hide();
      } else {
        this.$wrap.show();
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
`
          );
          const playerPage = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">
        <script type="text/javascript" src="../../src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="../../src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="../../src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="../../js/lib/smartbox.js"></script>
        <script type="text/javascript" src="../../js/playVideo.js"></script>
</head>
<style>
body {
  padding: 0;
  margin: 0;
}
.wrap {
  width: 100%;
  height: 100%;
}

</style>

<body>
  <div class="wrap">
    
  </div>
</body>
  <script type="text/javascript">
      $('html').keyup(function(e){
      if (e.keyCode === 8) {
        window.location='/'
      }
    })  
</script>
</html>`;

          res.send(playerPage); // Отправка ответа в виде HTML
        })
        .catch((error) => console.error("getMp4Videos2", error));
    }
  } catch (error) {
    console.error(error);
  }
}

async function getSearchedMovie() {
  try {
    app.get("/searchItem", (req, res) => {
      var name = req.originalUrl.split("=").pop();
      var correctName = name.replace("+", " ");
      sParameter = decodeURIComponent(correctName);

      function fetchMovie() {
        fetch(APISEARCH_URL + sParameter)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            const movieItem = data.results;
            movieItem.map((searchedItem, index) => {
              app.get(
                "/searchedMovieEpisodes=" + searchedItem.kinopoisk_id + index,
                (req, res) => {
                  let videos = [];
                  let videoSeasonsArrays = searchedItem.episodes
                    ? searchedItem.episodes
                    : "no episodes";
                  const url = "http://localhost:8000/api/link"; // ссылка на апи
                  let episodes = [];
                  if (videoSeasonsArrays !== "no episodes") {
                    const seasonsArr = [];
                    for (let key of Object.keys(searchedItem.episodes)) {
                      const episodesArr = [];
                      seasonsArr.push(key);
                      for (let value of Object.values(
                        searchedItem.episodes[key]
                      )) {
                        episodesArr.push(value);
                      }
                      episodes.push(episodesArr);
                    }

                    let items = episodes.map((value, seasonIndex) => {
                      let videoObject = value.map(
                        (element, episodeIndex) =>
                          `{
                     season: '${seasonIndex + 1}' + 'сезон',
                     episode: '${episodeIndex + 1}' + 'серия',
                     seasonNum: '${seasonIndex + 1}',
                     episodeNum: '${episodeIndex + 1}', 
                     id: '${searchedItem.kinopoisk_id}&${seasonIndex + 1}&${
                            episodeIndex + 1
                          }',
                     name: '${searchedItem.info.orig}',
                  },
          `
                      );
                      return videoObject.join("");
                    });
                    videos.push(items.join(""));
                    episodes.map((value, seasonIndex) => {
                      value.map((element, episodeIndex) => {
                        app.get(
                          "/player=" +
                            searchedItem.kinopoisk_id +
                            `&${seasonIndex + 1}&${episodeIndex + 1}`,
                          (req, res) => {
                            getMp4Videos(
                              searchedItem,
                              seasonIndex + 1,
                              episodeIndex + 1,
                              url,
                              res
                            );
                          }
                        );
                      });
                    });
                    fs.writeFile(
                      "./js/searchedMovie.js",
                      `(function () {
    "use strict"

    window.App.searchedMovie = [${videos}]
  })();
  `,
                      function (err) {
                        if (err) {
                          return console.log(err);
                        }
                        const episodesPage = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
        <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">
        <script type="text/javascript" src="../src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="../src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="../src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="../js/lib/smartbox.js"></script>
        <script type="text/javascript" src="../js/videoApp.js"></script>
        <script type="text/javascript" src="../js/searchedMovie.js"></script>
        <script type="text/javascript" src="../js/scenes/searchedSerials.js"></script>
        <script type="text/javascript" src="../js/scenes/navigation.js"></script>
</head>
<style>
body {
  padding: 0;
  margin: 0;
  background-image: url(../images/stars.png);
}

h4,p {
  color: white;
}
.focus {
  outline: 3px solid yellow;
}

.selectEpisode {
  display:flex;
  padding: 10px;
  width: 980px;
  height: 480px;
  background: #553c64;
  border: 2px solid #fff;
  border-radius: 10px;
  flex-wrap: wrap;
  align-content: flex-start;
}

.episodeBlock {
  display:flex;
  align-items:center;
  justify-content: center;
  background: #a200ff;
  border-radius: 5px;
  width: 150px;
  height: 35px;
  margin-right: 10px;
  margin-bottom: 3px;
  margin-top: 3px;
  border-radius: 5px;

}
.episodeBlock h4 {
  font-weight: bold;
  margin-right: 3px;
}

</style>

<body>
      <div class="selectEpisode selectEpisodeHidden navigation-items scene js-scene-serialSeasons" data-nav_loop="true">
    </div>
</body>
<script type="text/javascript">

      $('html').keyup(function(e){
      if (e.keyCode === 8) {
        window.location='/'
      }
    })  
</script>
</html>`;
                        res.send(episodesPage); // Отправка ответа в виде HTML
                      }
                    );
                    videos.splice(0, videos.length); // обнуляю массив чтобы не было одних и тех же серий и не было ошибки
                  } else {
                    fs.writeFileSync(
                      "./js/searchedMovie.js",
                      `(function () {
    "use strict"

    window.App.serialSeasons = [
      {
        season: "Смотреть",
        episode: "",
      }
    ] 
  })();
  `
                    );
                    getMp4Videos(searchedItem, ...[, ,], "videos", "video");
                  }
                }
              );
            });
            let items = movieItem.map(
              (element, index) =>
                `{
            filmPageId: 'filmid${element.kinopoisk_id + index}',
            id: '${element.kinopoisk_id + index}',
            kinopoisk_id: '${element.kinopoisk_id}',
            type: 'vod',
            imgurl: '${element.info.poster}',
            title: '${element.info.rus}',
            titleEng: '${element.info.orig}',
            created: '${element.info.year}',
            actors: '${element.info.actors}',
            director: '${element.info.director}',
            country: '${element.info.country}',
            text: '${element.info.description.replace(/[\n\r]+/g, "")}',
          },
          `
            );
            fs.writeFile(
              "./js/search/resultsOfSearch.js",
              `(function () {
    "use strict"

    window.App.searchedVideos = [
      ${items.join("")}
    ] 
  })();
  `,
              function () {
                fs.writeFileSync(
                  "./js/search/searchVideosRender.js",
                  `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  var itemHtml = _.template('<div data-content="filmInfo" data-film="{{filmPageId}}" data-id="{{id}}" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;" class="movieitem navigation-item nav-item" data-type="{{type}}"><h4 class="mainMovieTitle">{{title}}</h4></div>');
    
  window.App.scenes.video = {
    init: function () {
      this.$el = $(".js-scene-video");

      this.$el.on("click", ".movieitem", this.onItemClick)

      this.renderItems(App.searchedVideos);
      _inited = true;
    },

    onItemClick: function (e) {
        var filmPage = e.currentTarget.getAttribute("data-film");
        var scene = e.currentTarget.getAttribute("data-content");
        var item = "#" + filmPage;
        $(".header").hide();
        window.App.showContent(scene);
        $(".filmInfoPage").hide();
        $(item).show();
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
      var html = "";

      console.log(items, itemHtml.toString())
      for (var i = 0, len = items.length; i < len; i++) {
        html += itemHtml(items[i]);
      }

      this.$el.empty().html(html);
    },
  };
})();
    `
                );
                fs.writeFileSync(
                  "./js/search/searchFilmInfo.js",
                  `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;

  var filmPageHtml = _.template('<div id="{{filmPageId}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><img src="{{imgurl}}" alt="posterimg"><div class="film-dscrtn"><div><p class="actors">Актеры: {{actors}}</p><p>Страна: {{country}}</p><p>Год:{{created}}</p><p>Режиссер:{{director}}</p></div><h2 id="videotitle">{{title}}</h2></div></div><p class="description">{{text}}</p></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo"><img width="250" height="60" src="./images/UCS.svg" alt="logoimg"></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><img width="30" src="./images/arrowBack.svg" alt="arrow" /> Назад</li><li class="menu-item nav-item watchBtn" id="{{id}}"><h4>Смотреть</h4></li></ul></nav></div></div></div><script>var watchBtn = document.getElementById("{{id}}"); watchBtn.addEventListener("click", function (event) {document.location.href = "/searchedMovieEpisodes={{id}}"})</script>');
  
  window.App.scenes.filmInfo = {
    init: function () {
      this.$el = $(".js-scene-filmInfo");
      this.$el.on("click", ".back", this.onItemBackClick)
      this.renderItems(App.searchedVideos);
      _inited = true;
    },
      onItemBackClick: function (e) {
      var scene = e.currentTarget.getAttribute("data-content");
      $(".header").show();
      window.App.showContent(scene);
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
    `
                );
              }
            );

            fs.writeFileSync(
              "./js/search/searchedEpisodesOfFilm.js",
              `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;

  var seasonItems = _.template('<div id="{{id}}" data-content="serialSeasons" class="episodeBlock navigation-item nav-item" data-season="{{season}}" data-episode="{{episode}}"><h4>{{season}}</h4><p>{{episode}}</p></div><script>var selectEpisode = document.getElementById("{{id}}"); selectEpisode.addEventListener("click", function (event) {document.location.href = "/player={{id}}"})</script>')
  
  window.App.scenes.serialSeasons = {
    init: function () {
      this.$el = $(".js-scene-serialSeasons");
      this.renderItems(App.serialSeasons);
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
     console.log('items', items)
      for (var i = 0, len = items.length; i < len; i++) {
        seasonshtml += seasonItems(items[i]);
      }
      this.$el.empty().html(seasonshtml);
    },
  };
})();
    `
            );
            const message = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">

        <script type="text/javascript" src="./src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="./src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="./src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="./js/lib/smartbox.js"></script>
        <script type="text/javascript" src="./js/app.js"></script>
        <script type="text/javascript" src="./js/search/resultsOfSearch.js"></script>
        <script type="text/javascript" src="./js/search/searchVideosRender.js"></script>
        <script type="text/javascript" src="./js/search/searchFilmInfo.js"></script>
        <script type="text/javascript" src="./js/search/searchedEpisodesOfFilm.js"></script>
        <script type="text/javascript" src="./js/scenes/navigation.js"></script>
  
</head>

<style>

body {
    margin: 0;
    padding: 0;
    height: 100vh;
}

p,
h1, h2,
h3, h4, li {
    color: #fff;
    font-family: 'Inter', sans-serif;
}
.wrap {
    max-width: 1000px;
    margin: 0 auto;
    padding: 30px;
}
a {
    text-decoration: none;
}
h2,
h1 {
    font-weight: 400;
    margin: 10px 0;
}
.navbar {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;
    width: 100%;
    justify-content: space-between;
}
.movieitem {
    width: 140px;
    height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    cursor: pointer;
    margin: 0 20px 10px 20px;
}
.movieitem h4 {
  display: none;
}

.movieitem:hover h4{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
}

.movieitem:hover {
    border-bottom: 5px solid yellow;
    margin-bottom: -5px;
    border-radius: 10px;
}
.film-title {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
}
.film-title h2 {
    font-size: 12px;
}
.film-title p {
    color: yellow;
}
.movieitem p {
    margin: 0;
}
.movieitem img {
    height: 180px;
}


 .focus mainMovieTitle{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
 }

video {
    right:0;
    width:100%;
    z-index: 5;
}

.log-string {
    position: absolute;
    left: 50%;
}
.log-object {
    position: absolute;
        left: 50%;
}
.film-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    }
    li {
        list-style-type: none;
    }
.film-info_inner {
    display: flex;
    padding: 40px;
}
.UconCinema_logo {
    display: flex;
    align-items: center;
}
p {
    margin: 0;
}

.description {
  max-width: 80%;
}

.logo_text h4 {
    margin: 0;
    color: #fff;
}
.film-main {
    padding: 20px;
    display: flex;
    flex-direction: column;
    max-width: 75%;
}
.film-info {
    display: flex;
}
.film-info img {
    width: 25%;
    margin-bottom: 10px;
    margin-right: 20px;
}
.film-dscrtn {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding-bottom: 40px;
}
.actors {
    max-width: 80%;
    margin-bottom: 15px;
}
.film-dscrtn h2 {
    color: yellow;
}
.film-nav {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 0;
    background: #553c64;
    width: 30%;
    height: 100%;
}
.film-nav_logo {
    background: #3b3041;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.back {
  display: flex;
  align-items: center;
    font-size: 22px;
        padding: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.151);
        margin-left: -40px;
}
.watchBtn {
    display:flex;
    font-size: 22px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.151);
    margin-left: -40px;
    padding-left: 40px;
    margin-top: 3px;
}

.focus {
    border-bottom: 5px solid yellow;
    margin-bottom: -5px;
    border-radius: 5px;
}
.bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url(./images/stars.png);
            z-index: -1;
        }
.log-row {
  color: white;
  font-size: 24px;
}

.videoWaiting {
  display: none;
  position: absolute;
  top: 25%;
  left: 25%;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 500px;
  height: 350px;
  background: #553c64;
  border: 2px solid #fff;
  border-radius: 10px;
}
.videoWaiting h1 {
  color: #fff;
  font-weight: bold;
  font-family: 'Inter', sans-serif;
}


</style>
<body>

<div class="bg"></div>
<div id="app" class="wrap">
    <div id="movies" class="navbar navigation-items scene scene_video js-scene-video" data-nav_loop="true">
    </div>
    <div class="scene scene_filmInfo film-container js-scene-filmInfo" data-nav_loop="true">
    </div>
    </div>
    <script type='text/javascript'>
    
    window.document.onkeydown = key => {
        if (key.keyCode === 38) {
            var elem = document.querySelector('.focus');
            window.scrollTo(0, elem.offsetTop - 200);
        } else if (key.keyCode === 40) {
             var elem = document.querySelector('.focus');
             window.scrollTo(0, elem.offsetTop - 200);
        }
    }
      $('html').keyup(function(e){
      if (e.keyCode === 8) {
        window.location='/'
      }
    })  
    

    </script>
</body>
</html>`;

            res.send(message); // Отправка ответа в виде HTML
          })
          .catch((err) => console.error("getSearchedMovie", err));
      }
      fetchMovie();
    });
  } catch (error) {
    console.error(error);
  }
}
async function searchPage() {
  try {
    app.get("/search", (req, res) => {
      getSearchedMovie();

      const message = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">
       <link rel="stylesheet" href="../css/keyboard.css"/>
        <script type="text/javascript" src="../src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="../src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="../src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="../js/lib/smartbox.js"></script>
        <script type="text/javascript" src="../js/mainApp.js"></script>
        <script type="text/javascript" src="../js/scenes/navigation.js"></script>

</head>

<style>

body {
    margin: 0;
    padding: 0;
    position: relative;
    width: 1280px;
    height: 720px;
}

p,
h1, h2,
h3, h4, li {
    color: #fff;
    font-family: 'Inter', sans-serif;
}
.wrap {
    max-width: 1000px;
    margin: 0 auto;
    padding: 30px;
}
.bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url(./images/stars.png);
            z-index: -1;
        }
        .searchBlock {
            position: absolute;
            top: 40%;
            right: 60%;
            left: 40%;
            bottom: 60%;
            width: 400px;
        }
        .searchBlock-container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px;
            background-color: #553c64;
            border-radius: 10px;
        }
        .search-input {
            position: relative;
            margin-right: 10px;
            width: 350px;
            padding: 10px 20px;
            border: 1px solid white
        } 
        .search-button {
            position: relative;
        }
form .focus {
  border: 1px solid yellow;
}
</style>
<body>

<div class="bg"></div>
<div id="app" class="app wrap">
       <div class="searchBlock">
            <form action="/searchItem" class="scene js-scene-input navigation-items searchBlock-container" data-nav_loop="true">
                <input type="text" id="input" class="nav-item search-input input-item" name="input"
                    placeholder="Please enter your task">
                <button type="submit" id="inputBtn" class="navigation-item nav-item search-button">Найти</button>
            </form>
        </div>
</div>
<script type="text/javascript">
    SB.ready(function() {
        $('#input').SBInput({
            keyboard: {
                type: 'fulltext_ru'
            }
        });
        $$nav.on();
    });

      $('html').keyup(function(e){
      if (e.keyCode === 8) {
        window.location='/'
      }
    })  
</script>
</body>
</html>`;
      res.send(message); // Отправка ответа в виде HTML
    });
  } catch (error) {
    console.error(error);
  }
}
searchPage();

// ------------------- функция со всем функционалом Anime страницы -----------------------
async function getAnime() {
  try {
    app.get("/anime", (req, res) => {
      // ----------------------- Делаем запрос для получения списка фильмов или сериалов -----------------------
      const fetchData = fetch(APIANIME_URL, fetchOptions)
        .then((response) => {
          return response.json();
        })
        .catch((err) => console.error(err));

      // ----------------------- создаем файл со списком фильмов или сериалов -----------------------
      const showFilms = async () => {
        try {
          const commits = await fetchData;
          let items = commits.results.map(
            (element) =>
              `{
            id: '${element.kinopoisk_id}',
            type: 'vod',
            imgurl: '${element.info.poster}',
            title: '${element.info.rus}',
            titleEng: '${element.info.orig}',
            created: '${element.info.year}',
            filmPageId: 'filmid${element.kinopoisk_id}',
            actors: '${element.info.actors}',
            director: '${element.info.director}',
            country: '${element.info.country}',
            text: '${element.info.description.replace(/[\n\r]+/g, "")}',
          },
          `
          );
          return items;
        } catch (error) {
          console.error(error);
        }
      };
      // ----------------------- функция сезонов и эпизодов для фильмов или сериалов -----------------------
      const fetchVideos = async (wayToFile, nameOfUrl, responseName) => {
        try {
          const videosId = await fetchData;
          const url = "http://localhost:8000/api/link";
          videosId.results.map((item) => {
            let videos = [];
            let videoSeasonsArrays = item.episodes
              ? item.episodes
              : "no episodes";
            app.get("/selectepisodeId=" + item.kinopoisk_id, (req, res) => {
              let episodes = [];
              if (videoSeasonsArrays !== "no episodes") {
                const seasonsArr = [];
                for (let key of Object.keys(item.episodes)) {
                  const episodesArr = [];
                  seasonsArr.push(key);
                  for (let value of Object.values(item.episodes[key])) {
                    episodesArr.push(value);
                  }
                  episodes.push(episodesArr);
                }
                let items = episodes.map((value, seasonIndex) => {
                  let videoObject = value.map(
                    (element, episodeIndex) =>
                      `{
                     season: '${seasonIndex + 1}' + 'сезон',
                     episode: '${episodeIndex + 1}' + 'серия',
                     seasonNum: '${seasonIndex + 1}',
                     episodeNum: '${episodeIndex + 1}', 
                     id: '${item.kinopoisk_id}&${seasonIndex + 1}&${
                        episodeIndex + 1
                      }',
                     name: '${item.info.orig}',
                  },
          `
                  );
                  return videoObject.join("");
                });
                videos.push(items.join(""));
                episodes.map((value, seasonIndex) => {
                  value.map((element, episodeIndex) => {
                    app.get(
                      "/player=" +
                        item.kinopoisk_id +
                        `&${seasonIndex + 1}&${episodeIndex + 1}`,
                      (req, res) => {
                        getMp4Videos(
                          item,
                          seasonIndex + 1,
                          episodeIndex + 1,
                          url,
                          res
                        );
                      }
                    );
                  });
                });
                fs.writeFile(
                  wayToFile,
                  `(function () {
    "use strict"

    window.App.SerialSeasons = [${videos}]
  })();
  `,
                  function (err) {
                    if (err) {
                      return console.log(err);
                    }

                    const episodesPage = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
        <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">
        <script type="text/javascript" src="../src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="../src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="../src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="../js/lib/smartbox.js"></script>
        <script type="text/javascript" src="../js/videoApp.js"></script>
        <script type="text/javascript" src="../js/pagesFunctions/serialSeasons.js"></script>
        <script type="text/javascript" src="../js/scenes/filmSeasons.js"></script>
        <script type="text/javascript" src="../js/scenes/navigation.js"></script>
</head>
<style>
body {
  display: flex;
  padding: 15px 0 0 0;
  margin: 0;
  background-image: url(../images/stars.png);
  align-items: center;
  justify-content: center;
}

h4,p {
  color: white;
}
.focus {
  outline: 3px solid yellow;
}

.selectEpisode {
  display:flex;
  padding: 10px;
  min-width: 500px;
  max-width: 965px;
  width: auto;
  min-height: 300px
  height: auto;
  background: #553c64;
  border: 2px solid #fff;
  border-radius: 10px;
  flex-wrap: wrap;
  align-content: flex-start;
}

.episodeBlock {
  display:flex;
  align-items:center;
  justify-content: center;
  background: #a200ff;
  border-radius: 5px;
  width: 150px;
  height: 35px;
  margin-right: 10px;
  margin-bottom: 3px;
  margin-top: 3px;
  border-radius: 5px;

}
.episodeBlock h4 {
  font-weight: bold;
  margin-right: 3px;
}

</style>

<body>
      <div class="selectEpisode selectEpisodeHidden navigation-items scene js-scene-serialSeasons" data-nav_loop="true">
    </div>
</body>
</html>`;
                    res.send(episodesPage); // Отправка ответа в виде HTML
                  }
                );
                videos.splice(0, videos.length); // обнуляю массив чтобы не было одних и тех же серий и не было ошибки
              } else {
                fs.writeFileSync(
                  wayToFile,
                  `(function () {
    "use strict"

    window.App.SerialSeasons = [
      {
        season: "Смотреть",
        episode: "",
      }
    ] 
  })();
  `
                );
                getMp4Videos(item, ...[, ,], nameOfUrl, responseName);
              }
            });
          });
        } catch (error) {
          console.error(error);
        }
      };

      // создание файлов, в которых будут массивы с объектами, для работы с document
      async function sendFilms() {
        const movies = await showFilms();
        const movieItems = movies.join("");
        fs.writeFileSync(
          "./js/pagesFunctions/videos.js",
          `(function () {
    "use strict"

    window.App.videos = [
      ${movieItems}
    ] 
  })();
  `
        );
        fs.writeFileSync(
          "./js/pagesFunctions/FilmPage.js",
          `(function () {
    "use strict"

    window.App.filmInfo = [
      ${movieItems}
    ] 
  })();
  `
        );
      }

      sendFilms();
      // получение данных с запроса и создание объекта с данными запроса
      fs.writeFileSync(
        "./js/scenes/videosRender.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  var itemHtml = _.template('<div data-content="filmInfo" data-film="{{filmPageId}}" data-id="{{id}}" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;" class="movieitem navigation-item nav-item" data-type="{{type}}"><h4 class="mainMovieTitle">{{title}}</h4></div>');
    
  window.App.scenes.video = {
    init: function () {
      this.$el = $(".js-scene-video");

      this.$el.on("click", ".movieitem", this.onItemClick)

      this.renderItems(App.videos);
      _inited = true;
    },

    onItemClick: function (e) {
        var filmPage = e.currentTarget.getAttribute("data-film");
        var scene = e.currentTarget.getAttribute("data-content");
        var item = "#" + filmPage;
        $(".header").hide();
        window.App.showContent(scene);
        $(".filmInfoPage").hide();
        $(item).show();
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
      var html = "";

      // console.log(items, itemHtml.toString())
      for (var i = 0, len = items.length; i < len; i++) {
        html += itemHtml(items[i]);
      }

      this.$el.empty().html(html);
    },
  };
})();
    `
      );
      fs.writeFileSync(
        "./js/scenes/filmInfo.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;

  var filmPageHtml = _.template('<div id="{{filmPageId}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><img src="{{imgurl}}" alt="posterimg"><div class="film-dscrtn"><div><p class="actors">Актеры: {{actors}}</p><p>Страна: {{country}}</p><p>Год:{{created}}</p><p>Режиссер:{{director}}</p></div><h2 id="videotitle">{{title}}</h2></div></div><p class="description">{{text}}</p></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo"><img width="250" height="60" src="./images/UCS.svg" alt="logoimg"></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><img width="30" src="./images/arrowBack.svg" alt="arrow" /> Назад</li><li class="menu-item nav-item watchBtn" id="{{id}}"><h4>Смотреть</h4></li></ul></nav></div></div></div><script>var watchBtn = document.getElementById("{{id}}"); watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeId={{id}}"})</script>');
  
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
      window.App.showContent(scene);
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
    `
      );

      fetchVideos(
        "./js/pagesFunctions/serialSeasons.js",
        "animevideos",
        "animevideo"
      );

      fs.writeFileSync(
        "./js/scenes/filmSeasons.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;

  var seasonItems = _.template('<div id="{{id}}" data-content="serialSeasons" class="episodeBlock navigation-item nav-item" data-season="{{season}}" data-episode="{{episode}}"><h4>{{season}}</h4><p>{{episode}}</p></div><script>var selectEpisode = document.getElementById("{{id}}"); selectEpisode.addEventListener("click", function (event) {document.location.href = "/player={{id}}"})</script>')
  
  window.App.scenes.serialSeasons = {
    init: function () {
      this.$el = $(".js-scene-serialSeasons");
      this.renderItems(App.SerialSeasons);
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
     console.log('items', items)
      for (var i = 0, len = items.length; i < len; i++) {
        seasonshtml += seasonItems(items[i]);
      }
      this.$el.empty().html(seasonshtml);
    },
  };
})();
    `
      );
      const message = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">

        <script type="text/javascript" src="./src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="./src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="./src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="./js/lib/smartbox.js"></script>
        <script type="text/javascript" src="./js/app.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/FilmPage.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/videos.js"></script>
        <script type="text/javascript" src="./js/scenes/videosRender.js"></script>
        <script type="text/javascript" src="./js/scenes/filmInfo.js"></script>
        <script type="text/javascript" src="./js/scenes/navigation.js"></script>
  
</head>

<style>

body {
    margin: 0;
    padding: 0;
    height: 100vh;
}

p,
h1, h2,
h3, h4, li {
    color: #fff;
    font-family: 'Inter', sans-serif;
}
.wrap {
    max-width: 1000px;
    margin: 0 auto;
    padding: 30px;
}
a {
    text-decoration: none;
}
h2,
h1 {
    font-weight: 400;
    margin: 10px 0;
}
.navbar {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;
    width: 100%;
    justify-content: space-between;
}
.movieitem {
    width: 140px;
    height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    cursor: pointer;
    margin: 0 20px 10px 20px;
}
.movieitem h4 {
  display: none;
}

.movieitem:hover h4{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
}

.movieitem:hover {
    border-bottom: 5px solid yellow;
    margin-bottom: -5px;
    border-radius: 10px;
}
.film-title {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
}
.film-title h2 {
    font-size: 12px;
}
.film-title p {
    color: yellow;
}
.movieitem p {
    margin: 0;
}
.movieitem img {
    height: 180px;
}
.header h2 {
    text-transform: uppercase;
    text-decoration: underline;
    text-decoration-color: yellow;
    font-size: 35px;
}

 .focus mainMovieTitle{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
 }

video {
    right:0;
    width:100%;
    z-index: 5;
}
.header img {
    cursor: pointer;
}
.header {
  display: flex;
    align-items: center;
    justify-content: space-around;
    max-width: 1200px;
}
.header li {
    list-style-type: none;
    color: #fff;    
    font-size: 23px;
}
.log-string {
    position: absolute;
    left: 50%;
}
.log-object {
    position: absolute;
        left: 50%;
}
.film-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    }
    li {
        list-style-type: none;
    }
.film-info_inner {
    display: flex;
    padding: 40px;
}
.UconCinema_logo {
    display: flex;
    align-items: center;
}
p {
    margin: 0;
}

.description {
  max-width: 80%;
}

.logo_text h4 {
    margin: 0;
    color: #fff;
}
.film-main {
    padding: 20px;
    display: flex;
    flex-direction: column;
    max-width: 75%;
}
.film-info {
    display: flex;
}
.film-info img {
    width: 25%;
    margin-bottom: 10px;
    margin-right: 20px;
}
.film-dscrtn {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding-bottom: 40px;
}
.actors {
    max-width: 80%;
    margin-bottom: 15px;
}
.film-dscrtn h2 {
    color: yellow;
}
.film-nav {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 0;
    background: #553c64;
    width: 30%;
    height: 100%;
}
.film-nav_logo {
    background: #3b3041;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.back {
  display: flex;
  align-items: center;
    font-size: 22px;
        padding: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.151);
        margin-left: -40px;
}
.watchBtn {
    display:flex;
    font-size: 22px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.151);
    margin-left: -40px;
    padding-left: 40px;
    margin-top: 3px;
}

.focus {
    border-bottom: 5px solid yellow;
    margin-bottom: -5px;
    border-radius: 5px;
}
.bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url(./images/stars.png);
            z-index: -1;
        }
.log-row {
  color: white;
  font-size: 24px;
}

.videoWaiting {
  display: none;
  position: absolute;
  top: 25%;
  left: 25%;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 500px;
  height: 350px;
  background: #553c64;
  border: 2px solid #fff;
  border-radius: 10px;
}
.videoWaiting h1 {
  color: #fff;
  font-weight: bold;
  font-family: 'Inter', sans-serif;
}


</style>
<body>

<div class="bg"></div>
<div id="app" class="wrap">
        <div class="header navigation-items">
                <img class="navigation-item nav-item" width="30px" height="30px" src="./images/arrowBack.svg" alt="back" id="img_back">
                <li class="navigation-item nav-item" id='Films'>Фильмы</li>
                <li class="navigation-item nav-item" id='Serials'>Сериалы</li>
                <li class="navigation-item nav-item" id='Cartoons'>Мультфильмы</li>
                <h2>Аниме</h2>
                <li class="navigation-item nav-item" id='Premieres'>Премьеры</li>
                <li class="navigation-item nav-item" id='Compilations'>Подборки</li>
        
    </div>
    <div id="movies" class="navbar navigation-items scene scene_video js-scene-video" data-nav_loop="true">
    </div>
    <div class="scene scene_filmInfo film-container js-scene-filmInfo" data-nav_loop="true">
    </div>
    </div>
    <script type='text/javascript'>
    var backBtn = document.getElementById('img_back');
    var cartoons = document.getElementById('Cartoons');
    var serials = document.getElementById('Serials');
    var films = document.getElementById('Films');
    var premieres = document.getElementById('Premieres');
    var compilations = document.getElementById('Compilations');

    $('html').keyup(function(e){
      if (e.keyCode === 8) {
        window.location='/'
      }
    })  

    backBtn.addEventListener('click', function (event) {
            window.location='/'
    });

    cartoons.addEventListener('click', function (event) {
            window.location='/cartoons'
    });

    serials.addEventListener('click', function (event) {
            window.location='/serials'
    });

    films.addEventListener('click', function (event) {
            window.location='/films'
    });

    premieres.addEventListener('click', function (event) {
            window.location='/premieres'
    });

    compilations.addEventListener('click', function (event) {
            window.location='/compilations'
    });

    
    window.document.onkeydown = key => {
        if (key.keyCode === 38) {
            var elem = document.querySelector('.focus');
            window.scrollTo(0, elem.offsetTop - 200);
        } else if (key.keyCode === 40) {
             var elem = document.querySelector('.focus');
             window.scrollTo(0, elem.offsetTop - 200);
        }
    }
    
    

    </script>
</body>
</html>`;
      setTimeout(() => res.send(message), 500); // Отправка ответа в виде HTML (таймаут нужен для ожидания подгрузки фильмов или сериалов)
    });
  } catch (error) {
    console.error(error);
  }
}
// ------------------- функция со всем функционалом films страницы -----------------------
async function getFilms() {
  try {
    app.get("/films", (req, res) => {
      // ----------------------- Делаем запрос для получения списка фильмов или сериалов -----------------------
      const fetchData = fetch(APIFILMS_URL, fetchOptions)
        .then((response) => {
          return response.json();
        })
        .catch((err) => console.error(err));

      // ----------------------- создаем файл со списком фильмов или сериалов -----------------------
      const showFilms = async () => {
        try {
          const commits = await fetchData;
          let items = commits.results.map(
            (element) =>
              `{
            id: '${element.kinopoisk_id}',
            type: 'vod',
            imgurl: '${element.info.poster}',
            title: \`${element.info.rus}\`,
            titleEng: \`${element.info.orig}\`,
            created: '${element.info.year}',
            filmPageId: 'filmid${element.kinopoisk_id}',
            actors: '${element.info.actors}',
            director: '${element.info.director}',
            country: '${element.info.country}',
            text: '${element.info.description.replace(/[\n\r]+/g, "")}',
          },
          `
          );
          return items;
        } catch (error) {
          console.error(error);
        }
      };
      // создание файлов, в которых будут массивы с объектами, для работы с document
      async function sendFilms() {
        const movies = await showFilms();
        const movieItems = movies.join("");
        fs.writeFileSync(
          "./js/pagesFunctions/videos.js",
          `(function () {
    "use strict"

    window.App.videos = [
      ${movieItems}
    ] 
  })();
  `
        );
        fs.writeFileSync(
          "./js/pagesFunctions/FilmPage.js",
          `(function () {
    "use strict"

    window.App.filmInfo = [
      ${movieItems}
    ] 
  })();
  `
        );
      }

      sendFilms();
      // получение данных с запроса и создание объекта с данными запроса
      fs.writeFileSync(
        "./js/scenes/videosRender.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  var itemHtml = _.template('<div data-content="filmInfo" data-film="{{filmPageId}}" data-id="{{id}}" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;" class="movieitem navigation-item nav-item" data-type="{{type}}"><h4 class="mainMovieTitle">{{title}}</h4></div>');
    
  window.App.scenes.video = {
    init: function () {
      this.$el = $(".js-scene-video");

      this.$el.on("click", ".movieitem", this.onItemClick)

      this.renderItems(App.videos);
      _inited = true;
    },

    onItemClick: function (e) {
        var filmPage = e.currentTarget.getAttribute("data-film");
        var scene = e.currentTarget.getAttribute("data-content");
        var item = "#" + filmPage;
        $(".header").hide();
        window.App.showContent(scene);
        $(".filmInfoPage").hide();
        $(item).show();
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
      var html = "";

      // console.log(items, itemHtml.toString())
      for (var i = 0, len = items.length; i < len; i++) {
        html += itemHtml(items[i]);
      }

      this.$el.empty().html(html);
    },
  };
})();
    `
      );
      fs.writeFileSync(
        "./js/scenes/filmInfo.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;

  var filmPageHtml = _.template('<div id="{{filmPageId}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><img src="{{imgurl}}" alt="posterimg"><div class="film-dscrtn"><div><p class="actors">Актеры: {{actors}}</p><p>Страна: {{country}}</p><p>Год:{{created}}</p><p>Режиссер:{{director}}</p></div><h2 id="videotitle">{{title}}</h2></div></div><p class="description">{{text}}</p></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo"><img width="250" height="60" src="./images/UCS.svg" alt="logoimg"></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><img width="30" src="./images/arrowBack.svg" alt="arrow" /> Назад</li><li class="menu-item nav-item watchBtn" id="{{id}}"><h4>Смотреть</h4></li></ul></nav></div></div></div><script>var watchBtn = document.getElementById("{{id}}"); watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeId={{id}}"})</script>');
  
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
      window.App.showContent(scene);
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
    `
      );
      // ----------------------- функция сезонов и эпизодов для фильмов или сериалов -----------------------
      const fetchVideos = async (wayToFile, nameOfUrl, responseName) => {
        try {
          const videosId = await fetchData;
          const url = "http://localhost:8000/api/link";
          videosId.results.map((item) => {
            let videos = [];
            let videoSeasonsArrays = item.episodes
              ? item.episodes
              : "no episodes";
            app.get("/selectepisodeId=" + item.kinopoisk_id, (req, res) => {
              let episodes = [];
              if (videoSeasonsArrays !== "no episodes") {
                const seasonsArr = [];
                for (let key of Object.keys(item.episodes)) {
                  const episodesArr = [];
                  seasonsArr.push(key);
                  for (let value of Object.values(item.episodes[key])) {
                    episodesArr.push(value);
                  }
                  episodes.push(episodesArr);
                }
                let items = episodes.map((value, seasonIndex) => {
                  let videoObject = value.map(
                    (element, episodeIndex) =>
                      `{
                     season: '${seasonIndex + 1}' + 'сезон',
                     episode: '${episodeIndex + 1}' + 'серия',
                     seasonNum: '${seasonIndex + 1}',
                     episodeNum: '${episodeIndex + 1}', 
                     id: '${item.kinopoisk_id}&${seasonIndex + 1}&${
                        episodeIndex + 1
                      }',
                     name: '${item.info.orig}',
                  },
          `
                  );
                  return videoObject.join("");
                });
                videos.push(items.join(""));
                episodes.map((value, seasonIndex) => {
                  value.map((element, episodeIndex) => {
                    app.get(
                      "/player=" +
                        item.kinopoisk_id +
                        `&${seasonIndex + 1}&${episodeIndex + 1}`,
                      (req, res) => {
                        getMp4Videos(
                          item,
                          seasonIndex + 1,
                          episodeIndex + 1,
                          url,
                          res
                        );
                      }
                    );
                  });
                });
                fs.writeFile(
                  wayToFile,
                  `(function () {
    "use strict"

    window.App.SerialSeasons = [${videos}]
  })();
  `,
                  function (err) {
                    if (err) {
                      return console.log(err);
                    }
                    const episodesPage = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
        <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">
        <script type="text/javascript" src="../src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="../src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="../src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="../js/lib/smartbox.js"></script>
        <script type="text/javascript" src="../js/videoApp.js"></script>
        <script type="text/javascript" src="../js/pagesFunctions/serialSeasons.js"></script>
        <script type="text/javascript" src="../js/scenes/filmSeasons.js"></script>
        <script type="text/javascript" src="../js/scenes/navigation.js"></script>
</head>
<style>
body {
  display: flex;
  padding: 15px 0 0 0;
  margin: 0;
  background-image: url(../images/stars.png);
  align-items: center;
  justify-content: center;
}

h4,p {
  color: white;
}
.focus {
  outline: 3px solid yellow;
}

.selectEpisode {
  display:flex;
  padding: 10px;
  min-width: 500px;
  max-width: 965px;
  width: auto;
  min-height: 300px
  height: auto;
  background: #553c64;
  border: 2px solid #fff;
  border-radius: 10px;
  flex-wrap: wrap;
  align-content: flex-start;
}

.episodeBlock {
  display:flex;
  align-items:center;
  justify-content: center;
  background: #a200ff;
  border-radius: 5px;
  width: 150px;
  height: 35px;
  margin-right: 10px;
  margin-bottom: 3px;
  margin-top: 3px;
  border-radius: 5px;

}
.episodeBlock h4 {
  font-weight: bold;
  margin-right: 3px;
}

</style>

<body>
      <div class="selectEpisode selectEpisodeHidden navigation-items scene js-scene-serialSeasons" data-nav_loop="true">
    </div>
</body>
  <script type="text/javascript">
      $('html').keyup(function(e){
      if (e.keyCode === 8) {
        window.location='/'
      }
    })  
</script>
</html>`;
                    res.send(episodesPage); // Отправка ответа в виде HTML
                  }
                );
                videos.splice(0, videos.length); // обнуляю массив чтобы не было одних и тех же серий и не было ошибки
              } else {
                fs.writeFileSync(
                  wayToFile,
                  `(function () {
    "use strict"

    window.App.SerialSeasons = [
      {
        season: "Смотреть",
        episode: "",
      }
    ] 
  })();
  `
                );
                getMp4Videos(item, ...[, ,], nameOfUrl, responseName);
              }
            });
          });
        } catch (error) {
          console.error(error);
        }
      };

      fetchVideos("./js/pagesFunctions/serialSeasons.js", "videos", "video");

      fs.writeFileSync(
        "./js/scenes/filmSeasons.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;

  var seasonItems = _.template('<div id="{{id}}" data-content="serialSeasons" class="episodeBlock navigation-item nav-item" data-season="{{season}}" data-episode="{{episode}}"><h4>{{season}}</h4><p>{{episode}}</p></div><script>var selectEpisode = document.getElementById("{{id}}"); selectEpisode.addEventListener("click", function (event) {document.location.href = "/player={{id}}"})</script>')
  
  window.App.scenes.serialSeasons = {
    init: function () {
      this.$el = $(".js-scene-serialSeasons");
      this.renderItems(App.SerialSeasons);
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
     console.log('items', items)
      for (var i = 0, len = items.length; i < len; i++) {
        seasonshtml += seasonItems(items[i]);
      }
      this.$el.empty().html(seasonshtml);
    },
  };
})();
    `
      );
      const message = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">

        <script type="text/javascript" src="./src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="./src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="./src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="./js/lib/smartbox.js"></script>
        <script type="text/javascript" src="./js/app.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/FilmPage.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/videos.js"></script>
        <script type="text/javascript" src="./js/scenes/videosRender.js"></script>
        <script type="text/javascript" src="./js/scenes/filmInfo.js"></script>
        <script type="text/javascript" src="./js/scenes/navigation.js"></script>
  
</head>

<style>

body {
    margin: 0;
    padding: 0;
    height: 100vh;
}

p,
h1, h2,
h3, h4, li {
    color: #fff;
    font-family: 'Inter', sans-serif;
}
.wrap {
    max-width: 1000px;
    margin: 0 auto;
    padding: 30px;
}
a {
    text-decoration: none;
}
h2,
h1 {
    font-weight: 400;
    margin: 10px 0;
}
.navbar {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;
    width: 100%;
    justify-content: space-between;
}
.movieitem {
    width: 140px;
    height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    cursor: pointer;
    margin: 0 20px 10px 20px;
}
.movieitem h4 {
  display: none;
}

.movieitem:hover h4{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
}

.movieitem:hover {
    border-bottom: 5px solid yellow;
    margin-bottom: -5px;
    border-radius: 10px;
}
.film-title {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
}
.film-title h2 {
    font-size: 12px;
}
.film-title p {
    color: yellow;
}
.movieitem p {
    margin: 0;
}
.movieitem img {
    height: 180px;
}
.header h2 {
    text-transform: uppercase;
    text-decoration: underline;
    text-decoration-color: yellow;
    font-size: 35px;
}

 .focus mainMovieTitle{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
 }

video {
    right:0;
    width:100%;
    z-index: 5;
}
.header img {
    cursor: pointer;
}
.header {
  display: flex;
    align-items: center;
    justify-content: space-around;
    max-width: 1200px;
}
.header li {
    list-style-type: none;
    color: #fff;    
    font-size: 23px;
}
.log-string {
    position: absolute;
    left: 50%;
}
.log-object {
    position: absolute;
        left: 50%;
}
.film-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    }
    li {
        list-style-type: none;
    }
.film-info_inner {
    display: flex;
    padding: 40px;
}
.UconCinema_logo {
    display: flex;
    align-items: center;
}
p {
    margin: 0;
}

.description {
  max-width: 80%;
}

.logo_text h4 {
    margin: 0;
    color: #fff;
}
.film-main {
    padding: 20px;
    display: flex;
    flex-direction: column;
    max-width: 75%;
}
.film-info {
    display: flex;
}
.film-info img {
    width: 25%;
    margin-bottom: 10px;
    margin-right: 20px;
}
.film-dscrtn {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding-bottom: 40px;
}
.actors {
    max-width: 80%;
    margin-bottom: 15px;
}
.film-dscrtn h2 {
    color: yellow;
}
.film-nav {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 0;
    background: #553c64;
    width: 30%;
    height: 100%;
}
.film-nav_logo {
    background: #3b3041;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.back {
  display: flex;
  align-items: center;
    font-size: 22px;
        padding: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.151);
        margin-left: -40px;
}
.watchBtn {
    display:flex;
    font-size: 22px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.151);
    margin-left: -40px;
    padding-left: 40px;
    margin-top: 3px;
}

.focus {
    border-bottom: 5px solid yellow;
    margin-bottom: -5px;
    border-radius: 5px;
}
.bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url(./images/stars.png);
            z-index: -1;
        }
.log-row {
  color: white;
  font-size: 24px;
}

.videoWaiting {
  display: none;
  position: absolute;
  top: 25%;
  left: 25%;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 500px;
  height: 350px;
  background: #553c64;
  border: 2px solid #fff;
  border-radius: 10px;
}
.videoWaiting h1 {
  color: #fff;
  font-weight: bold;
  font-family: 'Inter', sans-serif;
}


</style>
<body>

<div class="bg"></div>
<div id="app" class="wrap">
        <div class="header navigation-items">
        <img class="navigation-item nav-item" width="30px" height="30px" src="./images/arrowBack.svg" alt="back" id="img_back">
                <h2>Фильмы</h2>
                <li class="navigation-item nav-item" id='Serials'>Сериалы</li>
                <li class="navigation-item nav-item" id='Cartoons'>Мультфильмы</li>
                <li class="navigation-item nav-item" id='anime'>Аниме</li>
                <li class="navigation-item nav-item" id='Premieres'>Премьеры</li>
                <li class="navigation-item nav-item" id='Compilations'>Подборки</li>
        
    </div>
    <div id="movies" class="navbar navigation-items scene scene_video js-scene-video" data-nav_loop="true">
    </div>
    <div class="scene scene_filmInfo film-container js-scene-filmInfo" data-nav_loop="true">
    </div>
    </div>
    <script type='text/javascript'>
    var backBtn = document.getElementById('img_back');
    var cartoons = document.getElementById('Cartoons')
    var serials = document.getElementById('Serials')
    var anime = document.getElementById('anime')
    var premieres = document.getElementById('Premieres')
    var compilations = document.getElementById('Compilations')

     $('html').keyup(function(e){
      if (e.keyCode === 8) {
        window.location='/'
      }
    })  

    backBtn.addEventListener('click', function (event) {
            window.location='/'
    });

    cartoons.addEventListener('click', function (event) {
            window.location='/cartoons'
    });

    serials.addEventListener('click', function (event) {
            window.location='/serials'
    });

    anime.addEventListener('click', function (event) {
            window.location='/anime'
    });

    premieres.addEventListener('click', function (event) {
            window.location='/premieres'
    });

    compilations.addEventListener('click', function (event) {
            window.location='/compilations'
    });

    
    window.document.onkeydown = key => {
        if (key.keyCode === 38) {
            var elem = document.querySelector('.focus');
            window.scrollTo(0, elem.offsetTop - 200);
        } else if (key.keyCode === 40) {
             var elem = document.querySelector('.focus');
             window.scrollTo(0, elem.offsetTop - 200);
        }
    }
    
    

    </script>
</body>
</html>`;
      setTimeout(() => res.send(message), 500); // Отправка ответа в виде HTML (таймаут нужен для ожидания подгрузки фильмов или сериалов)
    });
  } catch (error) {
    console.error(error);
  }
}
// ------------------- функция со всем функционалом serials страницы -----------------------
async function getSerials() {
  try {
    app.get("/serials", (req, res) => {
      // ----------------------- Делаем запрос для получения списка фильмов или сериалов -----------------------
      const fetchData = fetch(APISERIALS_URL, fetchOptions)
        .then((response) => {
          return response.json();
        })
        .catch((err) => console.error(err));

      // ----------------------- создаем файл со списком фильмов или сериалов -----------------------
      const showFilms = async () => {
        try {
          const commits = await fetchData;
          let items = commits.results.map(
            (element) =>
              `{
            id: '${element.kinopoisk_id}',
            type: 'vod',
            imgurl: '${element.info.poster}',
            title: \`${element.info.rus}\`,
            titleEng: \`${element.info.orig}\`,
            created: '${element.info.year}',
            filmPageId: 'filmid${element.kinopoisk_id}',
            actors: '${element.info.actors}',
            director: '${element.info.director}',
            country: '${element.info.country}',
            text: '${element.info.description.replace(/[\n\r]+/g, "")}',
          },
          `
          );
          return items;
        } catch (error) {
          console.error(error);
        }
      };
      // создание файлов, в которых будут массивы с объектами, для работы с document
      async function sendFilms() {
        const movies = await showFilms();
        const movieItems = movies.join("");
        fs.writeFileSync(
          "./js/pagesFunctions/videos.js",
          `(function () {
    "use strict"

    window.App.videos = [
      ${movieItems}
    ] 
  })();
  `
        );
        fs.writeFileSync(
          "./js/pagesFunctions/FilmPage.js",
          `(function () {
    "use strict"

    window.App.filmInfo = [
      ${movieItems}
    ] 
  })();
  `
        );
      }

      sendFilms();
      // получение данных с запроса и создание объекта с данными запроса
      fs.writeFileSync(
        "./js/scenes/videosRender.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  var itemHtml = _.template('<div data-content="filmInfo" data-film="{{filmPageId}}" data-id="{{id}}" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;" class="movieitem navigation-item nav-item" data-type="{{type}}"><h4 class="mainMovieTitle">{{title}}</h4></div>');
    
  window.App.scenes.video = {
    init: function () {
      this.$el = $(".js-scene-video");

      this.$el.on("click", ".movieitem", this.onItemClick)

      this.renderItems(App.videos);
      _inited = true;
    },

    onItemClick: function (e) {
        var filmPage = e.currentTarget.getAttribute("data-film");
        var scene = e.currentTarget.getAttribute("data-content");
        var item = "#" + filmPage;
        $(".header").hide();
        window.App.showContent(scene);
        $(".filmInfoPage").hide();
        $(item).show();
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
      var html = "";

      // console.log(items, itemHtml.toString())
      for (var i = 0, len = items.length; i < len; i++) {
        html += itemHtml(items[i]);
      }

      this.$el.empty().html(html);
    },
  };
})();
    `
      );
      fs.writeFileSync(
        "./js/scenes/filmInfo.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;

  var filmPageHtml = _.template('<div id="{{filmPageId}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><img src="{{imgurl}}" alt="posterimg"><div class="film-dscrtn"><div><p class="actors">Актеры: {{actors}}</p><p>Страна: {{country}}</p><p>Год:{{created}}</p><p>Режиссер:{{director}}</p></div><h2 id="videotitle">{{title}}</h2></div></div><p class="description">{{text}}</p></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo"><img width="250" height="60" src="./images/UCS.svg" alt="logoimg"></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><img width="30" src="./images/arrowBack.svg" alt="arrow" /> Назад</li><li class="menu-item nav-item watchBtn" id="{{id}}"><h4>Смотреть</h4></li></ul></nav></div></div></div><script>var watchBtn = document.getElementById("{{id}}"); watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeId={{id}}"})</script>');
  
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
      window.App.showContent(scene);
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
    `
      );
      // ----------------------- функция сезонов и эпизодов для фильмов или сериалов -----------------------
      const fetchVideos = async (wayToFile, nameOfUrl, responseName) => {
        try {
          const videosId = await fetchData;
          const url = "http://localhost:8000/api/link";
          videosId.results.map((item) => {
            let videos = [];
            let videoSeasonsArrays = item.episodes
              ? item.episodes
              : "no episodes";
            app.get("/selectepisodeId=" + item.kinopoisk_id, (req, res) => {
              let episodes = [];
              if (videoSeasonsArrays !== "no episodes") {
                const seasonsArr = [];
                for (let key of Object.keys(item.episodes)) {
                  const episodesArr = [];
                  seasonsArr.push(key);
                  for (let value of Object.values(item.episodes[key])) {
                    episodesArr.push(value);
                  }
                  episodes.push(episodesArr);
                }
                let items = episodes.map((value, seasonIndex) => {
                  let videoObject = value.map(
                    (element, episodeIndex) =>
                      `{
                     season: '${seasonIndex + 1}' + 'сезон',
                     episode: '${episodeIndex + 1}' + 'серия',
                     seasonNum: '${seasonIndex + 1}',
                     episodeNum: '${episodeIndex + 1}', 
                     id: '${item.kinopoisk_id}&${seasonIndex + 1}&${
                        episodeIndex + 1
                      }',
                     name: '${item.info.orig}',
                  },
          `
                  );
                  return videoObject.join("");
                });
                videos.push(items.join(""));
                episodes.map((value, seasonIndex) => {
                  value.map((element, episodeIndex) => {
                    app.get(
                      "/player=" +
                        item.kinopoisk_id +
                        `&${seasonIndex + 1}&${episodeIndex + 1}`,
                      (req, res) => {
                        getMp4Videos(
                          item,
                          seasonIndex + 1,
                          episodeIndex + 1,
                          url,
                          res
                        );
                      }
                    );
                  });
                });
                fs.writeFile(
                  wayToFile,
                  `(function () {
    "use strict"

    window.App.SerialSeasons = [${videos}]
  })();
  `,
                  function (err) {
                    if (err) {
                      return console.log(err);
                    }
                    const episodesPage = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
        <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">
        <script type="text/javascript" src="../src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="../src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="../src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="../js/lib/smartbox.js"></script>
        <script type="text/javascript" src="../js/videoApp.js"></script>
        <script type="text/javascript" src="../js/pagesFunctions/serialSeasons.js"></script>
        <script type="text/javascript" src="../js/scenes/filmSeasons.js"></script>
        <script type="text/javascript" src="../js/scenes/navigation.js"></script>
</head>
<style>
body {
  display: flex;
  padding: 15px 0 0 0;
  margin: 0;
  background-image: url(../images/stars.png);
  align-items: center;
  justify-content: center;
}

h4,p {
  color: white;
}
.focus {
  outline: 3px solid yellow;
}

.selectEpisode {
  display:flex;
  padding: 10px;
  min-width: 500px;
  max-width: 965px;
  width: auto;
  min-height: 300px
  height: auto;
  background: #553c64;
  border: 2px solid #fff;
  border-radius: 10px;
  flex-wrap: wrap;
  align-content: flex-start;
}

.episodeBlock {
  display:flex;
  align-items:center;
  justify-content: center;
  background: #a200ff;
  border-radius: 5px;
  width: 150px;
  height: 35px;
  margin-right: 10px;
  margin-bottom: 3px;
  margin-top: 3px;
  border-radius: 5px;

}
.episodeBlock h4 {
  font-weight: bold;
  margin-right: 3px;
}

</style>

<body>
      <div class="selectEpisode selectEpisodeHidden navigation-items scene js-scene-serialSeasons" data-nav_loop="true">
    </div>
</body>
  <script type="text/javascript">
      $('html').keyup(function(e){
      if (e.keyCode === 8) {
        window.location='/'
      }
    })  
</script>
</html>`;
                    res.send(episodesPage); // Отправка ответа в виде HTML
                  }
                );
                videos.splice(0, videos.length); // обнуляю массив чтобы не было одних и тех же серий и не было ошибки
              } else {
                fs.writeFileSync(
                  wayToFile,
                  `(function () {
    "use strict"

    window.App.SerialSeasons = [
      {
        season: "Смотреть",
        episode: "",
      }
    ] 
  })();
  `
                );
                getMp4Videos(item, ...[, ,], nameOfUrl, responseName);
              }
            });
          });
        } catch (error) {
          console.error(error);
        }
      };

      fetchVideos("./js/pagesFunctions/serialSeasons.js", "videos", "video");

      fs.writeFileSync(
        "./js/scenes/filmSeasons.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;

  var seasonItems = _.template('<div id="{{id}}" data-content="serialSeasons" class="episodeBlock navigation-item nav-item" data-season="{{season}}" data-episode="{{episode}}"><h4>{{season}}</h4><p>{{episode}}</p></div><script>var selectEpisode = document.getElementById("{{id}}"); selectEpisode.addEventListener("click", function (event) {document.location.href = "/player={{id}}"})</script>')
  
  window.App.scenes.serialSeasons = {
    init: function () {
      this.$el = $(".js-scene-serialSeasons");
      this.renderItems(App.SerialSeasons);
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
     console.log('items', items)
      for (var i = 0, len = items.length; i < len; i++) {
        seasonshtml += seasonItems(items[i]);
      }
      this.$el.empty().html(seasonshtml);
    },
  };
})();
    `
      );
      const message = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">

        <script type="text/javascript" src="./src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="./src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="./src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="./js/lib/smartbox.js"></script>
        <script type="text/javascript" src="./js/app.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/FilmPage.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/videos.js"></script>
        <script type="text/javascript" src="./js/scenes/videosRender.js"></script>
        <script type="text/javascript" src="./js/scenes/filmInfo.js"></script>
        <script type="text/javascript" src="./js/scenes/navigation.js"></script>
  
</head>

<style>

body {
    margin: 0;
    padding: 0;
    height: 100vh;
}

p,
h1, h2,
h3, h4, li {
    color: #fff;
    font-family: 'Inter', sans-serif;
}
.wrap {
    max-width: 1000px;
    margin: 0 auto;
    padding: 30px;
}
a {
    text-decoration: none;
}
h2,
h1 {
    font-weight: 400;
    margin: 10px 0;
}
.navbar {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;
    width: 100%;
    justify-content: space-between;
}
.movieitem {
    width: 140px;
    height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    cursor: pointer;
    margin: 0 20px 10px 20px;
}
.movieitem h4 {
  display: none;
}

.movieitem:hover h4{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
}

.movieitem:hover {
    border-bottom: 5px solid yellow;
    margin-bottom: -5px;
    border-radius: 10px;
}
.film-title {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
}
.film-title h2 {
    font-size: 12px;
}
.film-title p {
    color: yellow;
}
.movieitem p {
    margin: 0;
}
.movieitem img {
    height: 180px;
}
.header h2 {
    text-transform: uppercase;
    text-decoration: underline;
    text-decoration-color: yellow;
    font-size: 35px;
}

 .focus mainMovieTitle{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
 }

video {
    right:0;
    width:100%;
    z-index: 5;
}
.header img {
    cursor: pointer;
}
.header {
  display: flex;
    align-items: center;
    justify-content: space-around;
    max-width: 1200px;
}
.header li {
    list-style-type: none;
    color: #fff;    
    font-size: 23px;
}
.log-string {
    position: absolute;
    left: 50%;
}
.log-object {
    position: absolute;
        left: 50%;
}
.film-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    }
    li {
        list-style-type: none;
    }
.film-info_inner {
    display: flex;
    padding: 40px;
}
.UconCinema_logo {
    display: flex;
    align-items: center;
}
p {
    margin: 0;
}

.description {
  max-width: 80%;
}

.logo_text h4 {
    margin: 0;
    color: #fff;
}
.film-main {
    padding: 20px;
    display: flex;
    flex-direction: column;
    max-width: 75%;
}
.film-info {
    display: flex;
}
.film-info img {
    width: 25%;
    margin-bottom: 10px;
    margin-right: 20px;
}
.film-dscrtn {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding-bottom: 40px;
}
.actors {
    max-width: 80%;
    margin-bottom: 15px;
}
.film-dscrtn h2 {
    color: yellow;
}
.film-nav {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 0;
    background: #553c64;
    width: 30%;
    height: 100%;
}
.film-nav_logo {
    background: #3b3041;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.back {
  display: flex;
  align-items: center;
    font-size: 22px;
        padding: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.151);
        margin-left: -40px;
}
.watchBtn {
    display:flex;
    font-size: 22px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.151);
    margin-left: -40px;
    padding-left: 40px;
    margin-top: 3px;
}

.focus {
    border-bottom: 5px solid yellow;
    margin-bottom: -5px;
    border-radius: 5px;
}
.bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url(./images/stars.png);
            z-index: -1;
        }
.log-row {
  color: white;
  font-size: 24px;
}

.videoWaiting {
  display: none;
  position: absolute;
  top: 25%;
  left: 25%;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 500px;
  height: 350px;
  background: #553c64;
  border: 2px solid #fff;
  border-radius: 10px;
}
.videoWaiting h1 {
  color: #fff;
  font-weight: bold;
  font-family: 'Inter', sans-serif;
}


</style>
<body>

<div class="bg"></div>
<div id="app" class="wrap">
        <div class="header navigation-items">
         <img class="navigation-item nav-item" width="30px" height="30px" src="./images/arrowBack.svg" alt="back" id="img_back">
                <li class="navigation-item nav-item" id='films'>Фильмы</li>
                <h2>Сериалы</h2>
                <li class="navigation-item nav-item" id='Cartoons'>Мультфильмы</li>
                <li class="navigation-item nav-item" id='anime'>Аниме</li>
                <li class="navigation-item nav-item" id='Premieres'>Премьеры</li>
                <li class="navigation-item nav-item" id='Compilations'>Подборки</li>
    </div>
    <div id="movies" class="navbar navigation-items scene scene_video js-scene-video" data-nav_loop="true">
    </div>
    <div class="scene scene_filmInfo film-container js-scene-filmInfo" data-nav_loop="true">
    </div>
    </div>
    <script type='text/javascript'>
    var backBtn = document.getElementById('img_back');
    var cartoons = document.getElementById('Cartoons')
    var films = document.getElementById('films')
    var anime = document.getElementById('anime')
    var premieres = document.getElementById('Premieres')
    var compilations = document.getElementById('Compilations')
  
    
    $('html').keyup(function(e){
      if (e.keyCode === 8) {
        window.location='/'
      }
    })  

    backBtn.addEventListener('click', function (event) {
            window.location='/'
    });

    cartoons.addEventListener('click', function (event) {
            window.location='/cartoons'
    });

    films.addEventListener('click', function (event) {
            window.location='/films'
    });

    anime.addEventListener('click', function (event) {
            window.location='/anime'
    });

    premieres.addEventListener('click', function (event) {
            window.location='/premieres'
    });

    compilations.addEventListener('click', function (event) {
            window.location='/compilations'
    });

    
    window.document.onkeydown = key => {
        if (key.keyCode === 38) {
            var elem = document.querySelector('.focus');
            window.scrollTo(0, elem.offsetTop - 200);
        } else if (key.keyCode === 40) {
             var elem = document.querySelector('.focus');
             window.scrollTo(0, elem.offsetTop - 200);
        }
    }
    
    

    </script>
</body>
</html>`;
      setTimeout(() => res.send(message), 500); // Отправка ответа в виде HTML (таймаут нужен для ожидания подгрузки фильмов или сериалов)
    });
  } catch (error) {
    console.error(error);
  }
}
// ------------------- функция со всем функционалом cartoons страницы -----------------------
async function getCartoons() {
  try {
    app.get("/cartoons", (req, res) => {
      // ----------------------- Делаем запрос для получения списка фильмов или сериалов -----------------------
      const fetchData = fetch(APICARTOONS_URL, fetchOptions)
        .then((response) => {
          return response.json();
        })
        .catch((err) => console.error(err));

      // ----------------------- создаем файл со списком фильмов или сериалов -----------------------
      const showFilms = async () => {
        try {
          const commits = await fetchData;
          let items = commits.results.map(
            (element) =>
              `{
            id: '${element.kinopoisk_id}',
            type: 'vod',
            imgurl: '${element.info.poster}',
            title: \`${element.info.rus}\`,
            titleEng: \`${element.info.orig}\`,
            created: '${element.info.year}',
            filmPageId: 'filmid${element.kinopoisk_id}',
            actors: '${element.info.actors}',
            director: '${element.info.director}',
            country: '${element.info.country}',
            text: '${element.info.description.replace(/[\n\r]+/g, "")}',
          },
          `
          );
          return items;
        } catch (error) {
          console.error(error);
        }
      };
      // создание файлов, в которых будут массивы с объектами, для работы с document
      async function sendFilms() {
        const movies = await showFilms();
        const movieItems = movies.join("");
        fs.writeFileSync(
          "./js/pagesFunctions/videos.js",
          `(function () {
    "use strict"

    window.App.videos = [
      ${movieItems}
    ] 
  })();
  `
        );
        fs.writeFileSync(
          "./js/pagesFunctions/FilmPage.js",
          `(function () {
    "use strict"

    window.App.filmInfo = [
      ${movieItems}
    ] 
  })();
  `
        );
      }

      sendFilms();
      // получение данных с запроса и создание объекта с данными запроса
      fs.writeFileSync(
        "./js/scenes/videosRender.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  var itemHtml = _.template('<div data-content="filmInfo" data-film="{{filmPageId}}" data-id="{{id}}" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;" class="movieitem navigation-item nav-item" data-type="{{type}}"><h4 class="mainMovieTitle">{{title}}</h4></div>');
    
  window.App.scenes.video = {
    init: function () {
      this.$el = $(".js-scene-video");

      this.$el.on("click", ".movieitem", this.onItemClick)

      this.renderItems(App.videos);
      _inited = true;
    },

    onItemClick: function (e) {
        var filmPage = e.currentTarget.getAttribute("data-film");
        var scene = e.currentTarget.getAttribute("data-content");
        var item = "#" + filmPage;
        $(".header").hide();
        window.App.showContent(scene);
        $(".filmInfoPage").hide();
        $(item).show();
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
      var html = "";

      // console.log(items, itemHtml.toString())
      for (var i = 0, len = items.length; i < len; i++) {
        html += itemHtml(items[i]);
      }

      this.$el.empty().html(html);
    },
  };
})();
    `
      );
      fs.writeFileSync(
        "./js/scenes/filmInfo.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;

  var filmPageHtml = _.template('<div id="{{filmPageId}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><img src="{{imgurl}}" alt="posterimg"><div class="film-dscrtn"><div><p class="actors">Актеры: {{actors}}</p><p>Страна: {{country}}</p><p>Год:{{created}}</p><p>Режиссер:{{director}}</p></div><h2 id="videotitle">{{title}}</h2></div></div><p class="description">{{text}}</p></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo"><img width="250" height="60" src="./images/UCS.svg" alt="logoimg"></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><img width="30" src="./images/arrowBack.svg" alt="arrow" /> Назад</li><li class="menu-item nav-item watchBtn" id="{{id}}"><h4>Смотреть</h4></li></ul></nav></div></div></div><script>var watchBtn = document.getElementById("{{id}}"); watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeId={{id}}"})</script>');
  
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
      window.App.showContent(scene);
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
    `
      );
      // ----------------------- функция сезонов и эпизодов для фильмов или сериалов -----------------------
      const fetchVideos = async (wayToFile, nameOfUrl, responseName) => {
        try {
          const videosId = await fetchData;
          const url = "http://localhost:8000/api/link";
          videosId.results.map((item) => {
            let videos = [];
            let videoSeasonsArrays = item.episodes
              ? item.episodes
              : "no episodes";
            app.get("/selectepisodeId=" + item.kinopoisk_id, (req, res) => {
              let episodes = [];
              if (videoSeasonsArrays !== "no episodes") {
                const seasonsArr = [];
                for (let key of Object.keys(item.episodes)) {
                  const episodesArr = [];
                  seasonsArr.push(key);
                  for (let value of Object.values(item.episodes[key])) {
                    episodesArr.push(value);
                  }
                  episodes.push(episodesArr);
                }
                let items = episodes.map((value, seasonIndex) => {
                  let videoObject = value.map(
                    (element, episodeIndex) =>
                      `{
                     season: '${seasonIndex + 1}' + 'сезон',
                     episode: '${episodeIndex + 1}' + 'серия',
                     seasonNum: '${seasonIndex + 1}',
                     episodeNum: '${episodeIndex + 1}', 
                     id: '${item.kinopoisk_id}&${seasonIndex + 1}&${
                        episodeIndex + 1
                      }',
                     name: '${item.info.orig}',
                  },
          `
                  );
                  return videoObject.join("");
                });
                videos.push(items.join(""));
                episodes.map((value, seasonIndex) => {
                  value.map((element, episodeIndex) => {
                    app.get(
                      "/player=" +
                        item.kinopoisk_id +
                        `&${seasonIndex + 1}&${episodeIndex + 1}`,
                      (req, res) => {
                        getMp4Videos(
                          item,
                          seasonIndex + 1,
                          episodeIndex + 1,
                          url,
                          res
                        );
                      }
                    );
                  });
                });
                fs.writeFile(
                  wayToFile,
                  `(function () {
    "use strict"

    window.App.SerialSeasons = [${videos}]
  })();
  `,
                  function (err) {
                    if (err) {
                      return console.log(err);
                    }
                    const episodesPage = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
        <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">
        <script type="text/javascript" src="../src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="../src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="../src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="../js/lib/smartbox.js"></script>
        <script type="text/javascript" src="../js/videoApp.js"></script>
        <script type="text/javascript" src="../js/pagesFunctions/serialSeasons.js"></script>
        <script type="text/javascript" src="../js/scenes/filmSeasons.js"></script>
        <script type="text/javascript" src="../js/scenes/navigation.js"></script>
</head>
<style>
body {
  display: flex;
  padding: 15px 0 0 0;
  margin: 0;
  background-image: url(../images/stars.png);
  align-items: center;
  justify-content: center;
}

h4,p {
  color: white;
}
.focus {
  outline: 3px solid yellow;
}

.selectEpisode {
  display:flex;
  padding: 10px;
  min-width: 500px;
  max-width: 965px;
  width: auto;
  min-height: 300px
  height: auto;
  background: #553c64;
  border: 2px solid #fff;
  border-radius: 10px;
  flex-wrap: wrap;
  align-content: flex-start;
}

.episodeBlock {
  display:flex;
  align-items:center;
  justify-content: center;
  background: #a200ff;
  border-radius: 5px;
  width: 150px;
  height: 35px;
  margin-right: 10px;
  margin-bottom: 3px;
  margin-top: 3px;
  border-radius: 5px;

}
.episodeBlock h4 {
  font-weight: bold;
  margin-right: 3px;
}

</style>

<body>
      <div class="selectEpisode selectEpisodeHidden navigation-items scene js-scene-serialSeasons" data-nav_loop="true">
    </div>
</body>
  <script type="text/javascript">
      $('html').keyup(function(e){
      if (e.keyCode === 8) {
        window.location='/'
      }
    })  
</script>
</html>`;
                    res.send(episodesPage); // Отправка ответа в виде HTML
                  }
                );
                videos.splice(0, videos.length); // обнуляю массив чтобы не было одних и тех же серий и не было ошибки
              } else {
                fs.writeFileSync(
                  wayToFile,
                  `(function () {
    "use strict"

    window.App.SerialSeasons = [
      {
        season: "Смотреть",
        episode: "",
      }
    ] 
  })();
  `
                );
                getMp4Videos(item, ...[, ,], nameOfUrl, responseName);
              }
            });
          });
        } catch (error) {
          console.error(error);
        }
      };

      fetchVideos("./js/pagesFunctions/serialSeasons.js", "videos", "video");

      fs.writeFileSync(
        "./js/scenes/filmSeasons.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;

  var seasonItems = _.template('<div id="{{id}}" data-content="serialSeasons" class="episodeBlock navigation-item nav-item" data-season="{{season}}" data-episode="{{episode}}"><h4>{{season}}</h4><p>{{episode}}</p></div><script>var selectEpisode = document.getElementById("{{id}}"); selectEpisode.addEventListener("click", function (event) {document.location.href = "/player={{id}}"})</script>')
  
  window.App.scenes.serialSeasons = {
    init: function () {
      this.$el = $(".js-scene-serialSeasons");
      this.renderItems(App.SerialSeasons);
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
     console.log('items', items)
      for (var i = 0, len = items.length; i < len; i++) {
        seasonshtml += seasonItems(items[i]);
      }
      this.$el.empty().html(seasonshtml);
    },
  };
})();
    `
      );
      const message = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">

        <script type="text/javascript" src="./src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="./src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="./src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="./js/lib/smartbox.js"></script>
        <script type="text/javascript" src="./js/app.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/FilmPage.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/videos.js"></script>
        <script type="text/javascript" src="./js/scenes/videosRender.js"></script>
        <script type="text/javascript" src="./js/scenes/filmInfo.js"></script>
        <script type="text/javascript" src="./js/scenes/navigation.js"></script>
  
</head>

<style>

body {
    margin: 0;
    padding: 0;
    height: 100vh;
}

p,
h1, h2,
h3, h4, li {
    color: #fff;
    font-family: 'Inter', sans-serif;
}
.wrap {
    max-width: 1000px;
    margin: 0 auto;
    padding: 30px;
}
a {
    text-decoration: none;
}
h2,
h1 {
    font-weight: 400;
    margin: 10px 0;
}
.navbar {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;
    width: 100%;
    justify-content: space-between;
}
.movieitem {
    width: 140px;
    height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    cursor: pointer;
    margin: 0 20px 10px 20px;
}
.movieitem h4 {
  display: none;
}

.movieitem:hover h4{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
}

.movieitem:hover {
    border-bottom: 5px solid yellow;
    margin-bottom: -5px;
    border-radius: 10px;
}
.film-title {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
}
.film-title h2 {
    font-size: 12px;
}
.film-title p {
    color: yellow;
}
.movieitem p {
    margin: 0;
}
.movieitem img {
    height: 180px;
}
.header h2 {
    text-transform: uppercase;
    text-decoration: underline;
    text-decoration-color: yellow;
    font-size: 35px;
}

 .focus mainMovieTitle{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
 }

video {
    right:0;
    width:100%;
    z-index: 5;
}
.header img {
    cursor: pointer;
}
.header {
  display: flex;
    align-items: center;
    justify-content: space-around;
    max-width: 1200px;
}
.header li {
    list-style-type: none;
    color: #fff;    
    font-size: 23px;
}
.log-string {
    position: absolute;
    left: 50%;
}
.log-object {
    position: absolute;
        left: 50%;
}
.film-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    }
    li {
        list-style-type: none;
    }
.film-info_inner {
    display: flex;
    padding: 40px;
}
.UconCinema_logo {
    display: flex;
    align-items: center;
}
p {
    margin: 0;
}

.description {
  max-width: 80%;
}

.logo_text h4 {
    margin: 0;
    color: #fff;
}
.film-main {
    padding: 20px;
    display: flex;
    flex-direction: column;
    max-width: 75%;
}
.film-info {
    display: flex;
}
.film-info img {
    width: 25%;
    margin-bottom: 10px;
    margin-right: 20px;
}
.film-dscrtn {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding-bottom: 40px;
}
.actors {
    max-width: 80%;
    margin-bottom: 15px;
}
.film-dscrtn h2 {
    color: yellow;
}
.film-nav {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 0;
    background: #553c64;
    width: 30%;
    height: 100%;
}
.film-nav_logo {
    background: #3b3041;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.back {
  display: flex;
  align-items: center;
    font-size: 22px;
        padding: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.151);
        margin-left: -40px;
}
.watchBtn {
    display:flex;
    font-size: 22px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.151);
    margin-left: -40px;
    padding-left: 40px;
    margin-top: 3px;
}

.focus {
    border-bottom: 5px solid yellow;
    margin-bottom: -5px;
    border-radius: 5px;
}
.bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url(./images/stars.png);
            z-index: -1;
        }
.log-row {
  color: white;
  font-size: 24px;
}

.videoWaiting {
  display: none;
  position: absolute;
  top: 25%;
  left: 25%;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 500px;
  height: 350px;
  background: #553c64;
  border: 2px solid #fff;
  border-radius: 10px;
}
.videoWaiting h1 {
  color: #fff;
  font-weight: bold;
  font-family: 'Inter', sans-serif;
}


</style>
<body>

<div class="bg"></div>
<div id="app" class="wrap">
        <div class="header navigation-items">
         <img class="navigation-item nav-item" width="30px" height="30px" src="./images/arrowBack.svg" alt="back" id="img_back">
                <li class="navigation-item nav-item" id='films'>Фильмы</li>
                <li class="navigation-item nav-item" id='serials'>Сериалы</li>
                <h2>Мультфильмы</h2>
                <li class="navigation-item nav-item" id='anime'>Аниме</li>
                <li class="navigation-item nav-item" id='Premieres'>Премьеры</li>
                <li class="navigation-item nav-item" id='Compilations'>Подборки</li>
    </div>
    <div id="movies" class="navbar navigation-items scene scene_video js-scene-video" data-nav_loop="true">
    </div>
    <div class="scene scene_filmInfo film-container js-scene-filmInfo" data-nav_loop="true">
    </div>
    </div>
    <script type='text/javascript'>
    var backBtn = document.getElementById('img_back');
    var serials = document.getElementById('serials')
    var films = document.getElementById('films')
    var anime = document.getElementById('anime')
    var premieres = document.getElementById('Premieres')
    var compilations = document.getElementById('Compilations')


    $('html').keyup(function(e){
      if (e.keyCode === 8) {
        window.location='/'
      }
    })  

    backBtn.addEventListener('click', function (event) {
            window.location='/'
    });

    serials.addEventListener('click', function (event) {
            window.location='/serials'
    });

    films.addEventListener('click', function (event) {
            window.location='/films'
    });

    anime.addEventListener('click', function (event) {
            window.location='/anime'
    });

    premieres.addEventListener('click', function (event) {
            window.location='/premieres'
    });

    compilations.addEventListener('click', function (event) {
            window.location='/compilations'
    });

    
    window.document.onkeydown = key => {
        if (key.keyCode === 38) {
            var elem = document.querySelector('.focus');
            window.scrollTo(0, elem.offsetTop - 200);
        } else if (key.keyCode === 40) {
             var elem = document.querySelector('.focus');
             window.scrollTo(0, elem.offsetTop - 200);
        }
    }
    
    

    </script>
</body>
</html>`;
      setTimeout(() => res.send(message), 500); // Отправка ответа в виде HTML (таймаут нужен для ожидания подгрузки фильмов или сериалов)
    });
  } catch (error) {
    console.error(error);
  }
}
async function getPremieres() {
  try {
    app.get("/premieres", (req, res) => {
      // ----------------------- Делаем запрос для получения списка фильмов или сериалов -----------------------
      const fetchData = fetch(APIPREMIERES_URL, fetchOptions)
        .then((response) => {
          return response.json();
        })
        .catch((err) => console.error(err));

      // ----------------------- создаем файл со списком фильмов или сериалов -----------------------
      const showFilms = async () => {
        try {
          const commits = await fetchData;
          let items = commits.results.map(
            (element) =>
              `{
            id: '${element.kinopoisk_id}',
            type: 'vod',
            imgurl: '${element.info.poster}',
            title: \`${element.info.rus}\`,
            titleEng: \`${element.info.orig}\`,
            created: '${element.info.year}',
            filmPageId: 'filmid${element.kinopoisk_id}',
            actors: '${element.info.actors}',
            director: '${element.info.director}',
            country: '${element.info.country}',
            text: '${element.info.description.replace(/[\n\r]+/g, "")}',
          },
          `
          );
          return items;
        } catch (error) {
          console.error(error);
        }
      };
      // создание файлов, в которых будут массивы с объектами, для работы с document
      async function sendFilms() {
        const movies = await showFilms();
        const movieItems = movies.join("");
        fs.writeFileSync(
          "./js/pagesFunctions/videos.js",
          `(function () {
    "use strict"

    window.App.videos = [
      ${movieItems}
    ] 
  })();
  `
        );
        fs.writeFileSync(
          "./js/pagesFunctions/FilmPage.js",
          `(function () {
    "use strict"

    window.App.filmInfo = [
      ${movieItems}
    ] 
  })();
  `
        );
      }

      sendFilms();
      // получение данных с запроса и создание объекта с данными запроса
      fs.writeFileSync(
        "./js/scenes/videosRender.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  var itemHtml = _.template('<div data-content="filmInfo" data-film="{{filmPageId}}" data-id="{{id}}" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;" class="movieitem navigation-item nav-item" data-type="{{type}}"><h4 class="mainMovieTitle">{{title}}</h4></div>');
    
  window.App.scenes.video = {
    init: function () {
      this.$el = $(".js-scene-video");

      this.$el.on("click", ".movieitem", this.onItemClick)

      this.renderItems(App.videos);
      _inited = true;
    },

    onItemClick: function (e) {
        var filmPage = e.currentTarget.getAttribute("data-film");
        var scene = e.currentTarget.getAttribute("data-content");
        var item = "#" + filmPage;
        $(".header").hide();
        window.App.showContent(scene);
        $(".filmInfoPage").hide();
        $(item).show();
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
      var html = "";

      // console.log(items, itemHtml.toString())
      for (var i = 0, len = items.length; i < len; i++) {
        html += itemHtml(items[i]);
      }

      this.$el.empty().html(html);
    },
  };
})();
    `
      );
      fs.writeFileSync(
        "./js/scenes/filmInfo.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;

  var filmPageHtml = _.template('<div id="{{filmPageId}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><img src="{{imgurl}}" alt="posterimg"><div class="film-dscrtn"><div><p class="actors">Актеры: {{actors}}</p><p>Страна: {{country}}</p><p>Год:{{created}}</p><p>Режиссер:{{director}}</p></div><h2 id="videotitle">{{title}}</h2></div></div><p class="description">{{text}}</p></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo"><img width="250" height="60" src="./images/UCS.svg" alt="logoimg"></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><img width="30" src="./images/arrowBack.svg" alt="arrow" /> Назад</li><li class="menu-item nav-item watchBtn" id="{{id}}"><h4>Смотреть</h4></li></ul></nav></div></div></div><script>var watchBtn = document.getElementById("{{id}}"); watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeId={{id}}"})</script>');
  
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
      window.App.showContent(scene);
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
    `
      );
      // ----------------------- функция сезонов и эпизодов для фильмов или сериалов -----------------------
      const fetchVideos = async (wayToFile, nameOfUrl, responseName) => {
        try {
          const videosId = await fetchData;
          const url = "http://localhost:8000/api/link";
          videosId.results.map((item) => {
            let videos = [];
            let videoSeasonsArrays = item.episodes
              ? item.episodes
              : "no episodes";
            app.get("/selectepisodeId=" + item.kinopoisk_id, (req, res) => {
              let episodes = [];
              if (videoSeasonsArrays !== "no episodes") {
                const seasonsArr = [];
                for (let key of Object.keys(item.episodes)) {
                  const episodesArr = [];
                  seasonsArr.push(key);
                  for (let value of Object.values(item.episodes[key])) {
                    episodesArr.push(value);
                  }
                  episodes.push(episodesArr);
                }
                let items = episodes.map((value, seasonIndex) => {
                  let videoObject = value.map(
                    (element, episodeIndex) =>
                      `{
                     season: '${seasonIndex + 1}' + 'сезон',
                     episode: '${episodeIndex + 1}' + 'серия',
                     seasonNum: '${seasonIndex + 1}',
                     episodeNum: '${episodeIndex + 1}', 
                     id: '${item.kinopoisk_id}&${seasonIndex + 1}&${
                        episodeIndex + 1
                      }',
                     name: '${item.info.orig}',
                  },
          `
                  );
                  return videoObject.join("");
                });
                videos.push(items.join(""));
                episodes.map((value, seasonIndex) => {
                  value.map((element, episodeIndex) => {
                    app.get(
                      "/player=" +
                        item.kinopoisk_id +
                        `&${seasonIndex + 1}&${episodeIndex + 1}`,
                      (req, res) => {
                        getMp4Videos(
                          item,
                          seasonIndex + 1,
                          episodeIndex + 1,
                          url,
                          res
                        );
                      }
                    );
                  });
                });
                fs.writeFile(
                  wayToFile,
                  `(function () {
    "use strict"

    window.App.SerialSeasons = [${videos}]
  })();
  `,
                  function (err) {
                    if (err) {
                      return console.log(err);
                    }
                    const episodesPage = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
        <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">
        <script type="text/javascript" src="../src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="../src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="../src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="../js/lib/smartbox.js"></script>
        <script type="text/javascript" src="../js/videoApp.js"></script>
        <script type="text/javascript" src="../js/pagesFunctions/serialSeasons.js"></script>
        <script type="text/javascript" src="../js/scenes/filmSeasons.js"></script>
        <script type="text/javascript" src="../js/scenes/navigation.js"></script>
</head>
<style>
body {
  display: flex;
  padding: 15px 0 0 0;
  margin: 0;
  background-image: url(../images/stars.png);
  align-items: center;
  justify-content: center;
}

h4,p {
  color: white;
}
.focus {
  outline: 3px solid yellow;
}

.selectEpisode {
  display:flex;
  padding: 10px;
  min-width: 500px;
  max-width: 965px;
  width: auto;
  min-height: 300px
  height: auto;
  background: #553c64;
  border: 2px solid #fff;
  border-radius: 10px;
  flex-wrap: wrap;
  align-content: flex-start;
}

.episodeBlock {
  display:flex;
  align-items:center;
  justify-content: center;
  background: #a200ff;
  border-radius: 5px;
  width: 150px;
  height: 35px;
  margin-right: 10px;
  margin-bottom: 3px;
  margin-top: 3px;
  border-radius: 5px;

}
.episodeBlock h4 {
  font-weight: bold;
  margin-right: 3px;
}

</style>

<body>
      <div class="selectEpisode selectEpisodeHidden navigation-items scene js-scene-serialSeasons" data-nav_loop="true">
    </div>
</body>
  <script type="text/javascript">
      $('html').keyup(function(e){
      if (e.keyCode === 8) {
        window.location='/'
      }
    })  
</script>
</html>`;
                    res.send(episodesPage); // Отправка ответа в виде HTML
                  }
                );
                videos.splice(0, videos.length); // обнуляю массив чтобы не было одних и тех же серий и не было ошибки
              } else {
                fs.writeFileSync(
                  wayToFile,
                  `(function () {
    "use strict"

    window.App.SerialSeasons = [
      {
        season: "Смотреть",
        episode: "",
      }
    ] 
  })();
  `
                );
                getMp4Videos(item, ...[, ,], nameOfUrl, responseName);
              }
            });
          });
        } catch (error) {
          console.error(error);
        }
      };

      fetchVideos("./js/pagesFunctions/serialSeasons.js", "videos", "video");

      fs.writeFileSync(
        "./js/scenes/filmSeasons.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;

  var seasonItems = _.template('<div id="{{id}}" data-content="serialSeasons" class="episodeBlock navigation-item nav-item" data-season="{{season}}" data-episode="{{episode}}"><h4>{{season}}</h4><p>{{episode}}</p></div><script>var selectEpisode = document.getElementById("{{id}}"); selectEpisode.addEventListener("click", function (event) {document.location.href = "/player={{id}}"})</script>')
  
  window.App.scenes.serialSeasons = {
    init: function () {
      this.$el = $(".js-scene-serialSeasons");
      this.renderItems(App.SerialSeasons);
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
     console.log('items', items)
      for (var i = 0, len = items.length; i < len; i++) {
        seasonshtml += seasonItems(items[i]);
      }
      this.$el.empty().html(seasonshtml);
    },
  };
})();
    `
      );
      const message = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">

        <script type="text/javascript" src="./src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="./src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="./src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="./js/lib/smartbox.js"></script>
        <script type="text/javascript" src="./js/app.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/FilmPage.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/videos.js"></script>
        <script type="text/javascript" src="./js/scenes/videosRender.js"></script>
        <script type="text/javascript" src="./js/scenes/filmInfo.js"></script>
        <script type="text/javascript" src="./js/scenes/navigation.js"></script>
  
</head>

<style>

body {
    margin: 0;
    padding: 0;
    height: 100vh;
}

p,
h1, h2,
h3, h4, li {
    color: #fff;
    font-family: 'Inter', sans-serif;
}
.wrap {
    max-width: 1000px;
    margin: 0 auto;
    padding: 30px;
}
a {
    text-decoration: none;
}
h2,
h1 {
    font-weight: 400;
    margin: 10px 0;
}
.navbar {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;
    width: 100%;
    justify-content: space-between;
}
.movieitem {
    width: 140px;
    height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    cursor: pointer;
    margin: 0 20px 10px 20px;
}
.movieitem h4 {
  display: none;
}

.movieitem:hover h4{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
}

.movieitem:hover {
    border-bottom: 5px solid yellow;
    margin-bottom: -5px;
    border-radius: 10px;
}
.film-title {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
}
.film-title h2 {
    font-size: 12px;
}
.film-title p {
    color: yellow;
}
.movieitem p {
    margin: 0;
}
.movieitem img {
    height: 180px;
}
.header h2 {
    text-transform: uppercase;
    text-decoration: underline;
    text-decoration-color: yellow;
    font-size: 35px;
}

 .focus mainMovieTitle{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
 }

video {
    right:0;
    width:100%;
    z-index: 5;
}
.header img {
    cursor: pointer;
}
.header {
  display: flex;
    align-items: center;
    justify-content: space-around;
    max-width: 1200px;
}
.header li {
    list-style-type: none;
    color: #fff;    
    font-size: 23px;
}
.log-string {
    position: absolute;
    left: 50%;
}
.log-object {
    position: absolute;
        left: 50%;
}
.film-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    }
    li {
        list-style-type: none;
    }
.film-info_inner {
    display: flex;
    padding: 40px;
}
.UconCinema_logo {
    display: flex;
    align-items: center;
}
p {
    margin: 0;
}

.description {
  max-width: 80%;
}

.logo_text h4 {
    margin: 0;
    color: #fff;
}
.film-main {
    padding: 20px;
    display: flex;
    flex-direction: column;
    max-width: 75%;
}
.film-info {
    display: flex;
}
.film-info img {
    width: 25%;
    margin-bottom: 10px;
    margin-right: 20px;
}
.film-dscrtn {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding-bottom: 40px;
}
.actors {
    max-width: 80%;
    margin-bottom: 15px;
}
.film-dscrtn h2 {
    color: yellow;
}
.film-nav {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 0;
    background: #553c64;
    width: 30%;
    height: 100%;
}
.film-nav_logo {
    background: #3b3041;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.back {
  display: flex;
  align-items: center;
    font-size: 22px;
        padding: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.151);
        margin-left: -40px;
}
.watchBtn {
    display:flex;
    font-size: 22px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.151);
    margin-left: -40px;
    padding-left: 40px;
    margin-top: 3px;
}

.focus {
    border-bottom: 5px solid yellow;
    margin-bottom: -5px;
    border-radius: 5px;
}
.bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url(./images/stars.png);
            z-index: -1;
        }
.log-row {
  color: white;
  font-size: 24px;
}

.videoWaiting {
  display: none;
  position: absolute;
  top: 25%;
  left: 25%;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 500px;
  height: 350px;
  background: #553c64;
  border: 2px solid #fff;
  border-radius: 10px;
}
.videoWaiting h1 {
  color: #fff;
  font-weight: bold;
  font-family: 'Inter', sans-serif;
}


</style>
<body>

<div class="bg"></div>
<div id="app" class="wrap">
        <div class="header navigation-items">
        <img class="navigation-item nav-item" width="30px" height="30px" src="./images/arrowBack.svg" alt="back" id="img_back">
                <li class="navigation-item nav-item" id='films'>Фильмы</li>
                <li class="navigation-item nav-item" id='serials'>Сериалы</li>
                <li class="navigation-item nav-item" id='cartoons'>Мультфильмы</li>
                <li class="navigation-item nav-item" id='anime'>Аниме</li>
                <h2>Премьеры</h2>
                <li class="navigation-item nav-item" id='Compilations'>Подборки</li>
    </div>
    <div id="movies" class="navbar navigation-items scene scene_video js-scene-video" data-nav_loop="true">
    </div>
    <div class="scene scene_filmInfo film-container js-scene-filmInfo" data-nav_loop="true">
    </div>
    </div>
    <script type='text/javascript'>
    var backBtn = document.getElementById('img_back');
    var serials = document.getElementById('serials')
    var films = document.getElementById('films')
    var anime = document.getElementById('anime')
    var cartoons = document.getElementById('cartoons')
    var compilations = document.getElementById('Compilations')

    $('html').keyup(function(e){
      if (e.keyCode === 8) {
        window.location='/'
      }
    })  

    backBtn.addEventListener('click', function (event) {
            window.location='/'
    });

    serials.addEventListener('click', function (event) {
            window.location='/serials'
    });

    films.addEventListener('click', function (event) {
            window.location='/films'
    });

    anime.addEventListener('click', function (event) {
            window.location='/anime'
    });

    cartoons.addEventListener('click', function (event) {
            window.location='/cartoons'
    });

    compilations.addEventListener('click', function (event) {
            window.location='/compilations'
    });

    
    window.document.onkeydown = key => {
        if (key.keyCode === 38) {
            var elem = document.querySelector('.focus');
            window.scrollTo(0, elem.offsetTop - 200);
        } else if (key.keyCode === 40) {
             var elem = document.querySelector('.focus');
             window.scrollTo(0, elem.offsetTop - 200);
        }
    }
    
    

    </script>
</body>
</html>`;
      setTimeout(() => res.send(message), 500); // Отправка ответа в виде HTML (таймаут нужен для ожидания подгрузки фильмов или сериалов)
    });
  } catch (error) {
    console.error(error);
  }
}
async function getCompilations() {
  try {
    app.get("/compilations", (req, res) => {
      // ----------------------- Делаем запрос для получения списка фильмов или сериалов -----------------------
      const fetchData = fetch(APICOMPILATIONS_URL, fetchOptions)
        .then((response) => {
          return response.json();
        })
        .catch((err) => console.error(err));

      // ----------------------- создаем файл со списком фильмов или сериалов -----------------------
      const showFilms = async () => {
        try {
          const commits = await fetchData;
          let items = commits.results.map(
            (element) =>
              `{
            id: '${element.kinopoisk_id}',
            type: 'vod',
            imgurl: '${element.info.poster}',
            title: \`${element.info.rus}\`,
            titleEng: \`${element.info.orig}\`,
            created: '${element.info.year}',
            filmPageId: 'filmid${element.kinopoisk_id}',
            actors: '${element.info.actors}',
            director: '${element.info.director}',
            country: '${element.info.country}',
            text: '${element.info.description.replace(/[\n\r]+/g, "")}',
          },
          `
          );
          return items;
        } catch (error) {
          console.error(error);
        }
      };
      // создание файлов, в которых будут массивы с объектами, для работы с document
      async function sendFilms() {
        const movies = await showFilms();
        const movieItems = movies.join("");
        fs.writeFileSync(
          "./js/pagesFunctions/videos.js",
          `(function () {
    "use strict"

    window.App.videos = [
      ${movieItems}
    ] 
  })();
  `
        );
        fs.writeFileSync(
          "./js/pagesFunctions/FilmPage.js",
          `(function () {
    "use strict"

    window.App.filmInfo = [
      ${movieItems}
    ] 
  })();
  `
        );
      }

      sendFilms();
      // получение данных с запроса и создание объекта с данными запроса
      fs.writeFileSync(
        "./js/scenes/videosRender.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  var itemHtml = _.template('<div data-content="filmInfo" data-film="{{filmPageId}}" data-id="{{id}}" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;" class="movieitem navigation-item nav-item" data-type="{{type}}"><h4 class="mainMovieTitle">{{title}}</h4></div>');
    
  window.App.scenes.video = {
    init: function () {
      this.$el = $(".js-scene-video");

      this.$el.on("click", ".movieitem", this.onItemClick)

      this.renderItems(App.videos);
      _inited = true;
    },

    onItemClick: function (e) {
        var filmPage = e.currentTarget.getAttribute("data-film");
        var scene = e.currentTarget.getAttribute("data-content");
        var item = "#" + filmPage;
        $(".header").hide();
        window.App.showContent(scene);
        $(".filmInfoPage").hide();
        $(item).show();
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
      var html = "";

      // console.log(items, itemHtml.toString())
      for (var i = 0, len = items.length; i < len; i++) {
        html += itemHtml(items[i]);
      }

      this.$el.empty().html(html);
    },
  };
})();
    `
      );
      fs.writeFileSync(
        "./js/scenes/filmInfo.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;

  var filmPageHtml = _.template('<div id="{{filmPageId}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><img src="{{imgurl}}" alt="posterimg"><div class="film-dscrtn"><div><p class="actors">Актеры: {{actors}}</p><p>Страна: {{country}}</p><p>Год:{{created}}</p><p>Режиссер:{{director}}</p></div><h2 id="videotitle">{{title}}</h2></div></div><p class="description">{{text}}</p></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo"><img width="250" height="60" src="./images/UCS.svg" alt="logoimg"></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><img width="30" src="./images/arrowBack.svg" alt="arrow" /> Назад</li><li class="menu-item nav-item watchBtn" id="{{id}}"><h4>Смотреть</h4></li></ul></nav></div></div></div><script>var watchBtn = document.getElementById("{{id}}"); watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeId={{id}}"})</script>');
  
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
      window.App.showContent(scene);
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
    `
      );
      // ----------------------- функция сезонов и эпизодов для фильмов или сериалов -----------------------
      const fetchVideos = async (wayToFile, nameOfUrl, responseName) => {
        try {
          const videosId = await fetchData;
          const url = "http://localhost:8000/api/link";
          videosId.results.map((item) => {
            let videos = [];
            let videoSeasonsArrays = item.episodes
              ? item.episodes
              : "no episodes";
            app.get("/selectepisodeId=" + item.kinopoisk_id, (req, res) => {
              let episodes = [];
              if (videoSeasonsArrays !== "no episodes") {
                const seasonsArr = [];
                for (let key of Object.keys(item.episodes)) {
                  const episodesArr = [];
                  seasonsArr.push(key);
                  for (let value of Object.values(item.episodes[key])) {
                    episodesArr.push(value);
                  }
                  episodes.push(episodesArr);
                }
                let items = episodes.map((value, seasonIndex) => {
                  let videoObject = value.map(
                    (element, episodeIndex) =>
                      `{
                     season: '${seasonIndex + 1}' + 'сезон',
                     episode: '${episodeIndex + 1}' + 'серия',
                     seasonNum: '${seasonIndex + 1}',
                     episodeNum: '${episodeIndex + 1}', 
                     id: '${item.kinopoisk_id}&${seasonIndex + 1}&${
                        episodeIndex + 1
                      }',
                     name: '${item.info.orig}',
                  },
          `
                  );
                  return videoObject.join("");
                });
                videos.push(items.join(""));
                episodes.map((value, seasonIndex) => {
                  value.map((element, episodeIndex) => {
                    app.get(
                      "/player=" +
                        item.kinopoisk_id +
                        `&${seasonIndex + 1}&${episodeIndex + 1}`,
                      (req, res) => {
                        getMp4Videos(
                          item,
                          seasonIndex + 1,
                          episodeIndex + 1,
                          url,
                          res
                        );
                      }
                    );
                  });
                });
                fs.writeFile(
                  wayToFile,
                  `(function () {
    "use strict"

    window.App.SerialSeasons = [${videos}]
  })();
  `,
                  function (err) {
                    if (err) {
                      return console.log(err);
                    }
                    const episodesPage = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
        <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">
        <script type="text/javascript" src="../src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="../src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="../src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="../js/lib/smartbox.js"></script>
        <script type="text/javascript" src="../js/videoApp.js"></script>
        <script type="text/javascript" src="../js/pagesFunctions/serialSeasons.js"></script>
        <script type="text/javascript" src="../js/scenes/filmSeasons.js"></script>
        <script type="text/javascript" src="../js/scenes/navigation.js"></script>
</head>
<style>
body {
  display: flex;
  padding: 15px 0 0 0;
  margin: 0;
  background-image: url(../images/stars.png);
  align-items: center;
  justify-content: center;
}

h4,p {
  color: white;
}
.focus {
  outline: 3px solid yellow;
}

.selectEpisode {
  display:flex;
  padding: 10px;
  min-width: 500px;
  max-width: 965px;
  width: auto;
  min-height: 300px
  height: auto;
  background: #553c64;
  border: 2px solid #fff;
  border-radius: 10px;
  flex-wrap: wrap;
  align-content: flex-start;
}

.episodeBlock {
  display:flex;
  align-items:center;
  justify-content: center;
  background: #a200ff;
  border-radius: 5px;
  width: 150px;
  height: 35px;
  margin-right: 10px;
  margin-bottom: 3px;
  margin-top: 3px;
  border-radius: 5px;

}
.episodeBlock h4 {
  font-weight: bold;
  margin-right: 3px;
}

</style>

<body>
      <div class="selectEpisode selectEpisodeHidden navigation-items scene js-scene-serialSeasons" data-nav_loop="true">
    </div>
</body>
  <script type="text/javascript">
      $('html').keyup(function(e){
      if (e.keyCode === 8) {
        window.location='/'
      }
    })  
</script>
</html>`;
                    res.send(episodesPage); // Отправка ответа в виде HTML
                  }
                );
                videos.splice(0, videos.length); // обнуляю массив чтобы не было одних и тех же серий и не было ошибки
              } else {
                fs.writeFileSync(
                  wayToFile,
                  `(function () {
    "use strict"

    window.App.SerialSeasons = [
      {
        season: "Смотреть",
        episode: "",
      }
    ] 
  })();
  `
                );
                getMp4Videos(item, ...[, ,], nameOfUrl, responseName);
              }
            });
          });
        } catch (error) {
          console.error(error);
        }
      };

      fetchVideos("./js/pagesFunctions/serialSeasons.js", "videos", "video");

      fs.writeFileSync(
        "./js/scenes/filmSeasons.js",
        `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;

  var seasonItems = _.template('<div id="{{id}}" data-content="serialSeasons" class="episodeBlock navigation-item nav-item" data-season="{{season}}" data-episode="{{episode}}"><h4>{{season}}</h4><p>{{episode}}</p></div><script>var selectEpisode = document.getElementById("{{id}}"); selectEpisode.addEventListener("click", function (event) {document.location.href = "/player={{id}}"})</script>')
  
  window.App.scenes.serialSeasons = {
    init: function () {
      this.$el = $(".js-scene-serialSeasons");
      this.renderItems(App.SerialSeasons);
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
     console.log('items', items)
      for (var i = 0, len = items.length; i < len; i++) {
        seasonshtml += seasonItems(items[i]);
      }
      this.$el.empty().html(seasonshtml);
    },
  };
})();
    `
      );
      const message = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>tv</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Nunito+Sans:wght@200&display=swap"
        rel="stylesheet">

        <script type="text/javascript" src="./src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="./src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="./src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="./js/lib/smartbox.js"></script>
        <script type="text/javascript" src="./js/app.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/FilmPage.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/videos.js"></script>
        <script type="text/javascript" src="./js/scenes/videosRender.js"></script>
        <script type="text/javascript" src="./js/scenes/filmInfo.js"></script>
        <script type="text/javascript" src="./js/scenes/navigation.js"></script>
  
</head>

<style>

body {
    margin: 0;
    padding: 0;
    height: 100vh;
}

p,
h1, h2,
h3, h4, li {
    color: #fff;
    font-family: 'Inter', sans-serif;
}
.wrap {
    max-width: 1000px;
    margin: 0 auto;
    padding: 30px;
}
a {
    text-decoration: none;
}
h2,
h1 {
    font-weight: 400;
    margin: 10px 0;
}
.navbar {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;
    width: 100%;
    justify-content: space-between;
}
.movieitem {
    width: 140px;
    height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    cursor: pointer;
    margin: 0 20px 10px 20px;
}
.movieitem h4 {
  display: none;
}

.movieitem:hover h4{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
}

.movieitem:hover {
    border-bottom: 5px solid yellow;
    margin-bottom: -5px;
    border-radius: 10px;
}
.film-title {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
}
.film-title h2 {
    font-size: 12px;
}
.film-title p {
    color: yellow;
}
.movieitem p {
    margin: 0;
}
.movieitem img {
    height: 180px;
}
.header h2 {
    text-transform: uppercase;
    text-decoration: underline;
    text-decoration-color: yellow;
    font-size: 35px;
}

 .focus mainMovieTitle{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
 }

video {
    right:0;
    width:100%;
    z-index: 5;
}
.header img {
    cursor: pointer;
}
.header {
  display: flex;
    align-items: center;
    justify-content: space-around;
    max-width: 1200px;
}
.header li {
    list-style-type: none;
    color: #fff;    
    font-size: 23px;
}
.log-string {
    position: absolute;
    left: 50%;
}
.log-object {
    position: absolute;
        left: 50%;
}
.film-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    }
    li {
        list-style-type: none;
    }
.film-info_inner {
    display: flex;
    padding: 40px;
}
.UconCinema_logo {
    display: flex;
    align-items: center;
}
p {
    margin: 0;
}

.description {
  max-width: 80%;
}

.logo_text h4 {
    margin: 0;
    color: #fff;
}
.film-main {
    padding: 20px;
    display: flex;
    flex-direction: column;
    max-width: 75%;
}
.film-info {
    display: flex;
}
.film-info img {
    width: 25%;
    margin-bottom: 10px;
    margin-right: 20px;
}
.film-dscrtn {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding-bottom: 40px;
}
.actors {
    max-width: 80%;
    margin-bottom: 15px;
}
.film-dscrtn h2 {
    color: yellow;
}
.film-nav {
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 0;
    background: #553c64;
    width: 30%;
    height: 100%;
}
.film-nav_logo {
    background: #3b3041;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.back {
  display: flex;
  align-items: center;
    font-size: 22px;
        padding: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.151);
        margin-left: -40px;
}
.watchBtn {
    display:flex;
    font-size: 22px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.151);
    margin-left: -40px;
    padding-left: 40px;
    margin-top: 3px;
}

.focus {
    border-bottom: 5px solid yellow;
    margin-bottom: -5px;
    border-radius: 5px;
}
.bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url(./images/stars.png);
            z-index: -1;
        }
.log-row {
  color: white;
  font-size: 24px;
}

.videoWaiting {
  display: none;
  position: absolute;
  top: 25%;
  left: 25%;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 500px;
  height: 350px;
  background: #553c64;
  border: 2px solid #fff;
  border-radius: 10px;
}
.videoWaiting h1 {
  color: #fff;
  font-weight: bold;
  font-family: 'Inter', sans-serif;
}


</style>
<body>

<div class="bg"></div>
<div id="app" class="wrap">
        <div class="header navigation-items">
        <img class="navigation-item nav-item" width="30px" height="30px" src="./images/arrowBack.svg" alt="back" id="img_back">
                <li class="navigation-item nav-item" id='films'>Фильмы</li>
                <li class="navigation-item nav-item" id='serials'>Сериалы</li>
                <li class="navigation-item nav-item" id='cartoons'>Мультфильмы</li>
                <li class="navigation-item nav-item" id='anime'>Аниме</li>
                <li class="navigation-item nav-item" id='Premieres'>Премьеры</li>
                <h2>Подборки</h2>
    </div>
    <div id="movies" class="navbar navigation-items scene scene_video js-scene-video" data-nav_loop="true">
    </div>
    <div class="scene scene_filmInfo film-container js-scene-filmInfo" data-nav_loop="true">
    </div>
    </div>
    <script type='text/javascript'>
    var backBtn = document.getElementById('img_back');
    var serials = document.getElementById('serials')
    var films = document.getElementById('films')
    var anime = document.getElementById('anime')
    var premieres = document.getElementById('Premieres')
    var cartoons = document.getElementById('cartoons')

      $('html').keyup(function(e){
      if (e.keyCode === 8) {
        window.location='/'
      }
    })  

    backBtn.addEventListener('click', function (event) {
            window.location='/'
    });

    serials.addEventListener('click', function (event) {
            window.location='/serials'
    });

    films.addEventListener('click', function (event) {
            window.location='/films'
    });

    anime.addEventListener('click', function (event) {
            window.location='/anime'
    });

    premieres.addEventListener('click', function (event) {
            window.location='/premieres'
    });

    cartoons.addEventListener('click', function (event) {
            window.location='/cartoons'
    });

    
    window.document.onkeydown = key => {
        if (key.keyCode === 38) {
            var elem = document.querySelector('.focus');
            window.scrollTo(0, elem.offsetTop - 200);
        } else if (key.keyCode === 40) {
             var elem = document.querySelector('.focus');
             window.scrollTo(0, elem.offsetTop - 200);
        }
    }
    
    

    </script>
</body>
</html>`;
      setTimeout(() => res.send(message), 500); // Отправка ответа в виде HTML (таймаут нужен для ожидания подгрузки фильмов или сериалов)
    });
  } catch (error) {
    console.error(error);
  }
}

getFilms();
getCompilations();
getSerials();
getCartoons();
getAnime();
getPremieres();

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Server is listening on port ${port}`);
