const express = require("express");
require("dotenv").config(); // Config file
const fetch = require("node-fetch");
var app = express();
const path = require("path");
var _ = require("lodash");
const fs = require("fs");
app.use(express.static(__dirname));

// API BAZON_TOKEN
const API_TOKEN = process.env.BAZON_TOKEN;
// IP С БАЗОНА ДЛЯ ВИДЕОФАЙЛОВ ДЛЯ ВСТАВКИ В ПЕРЕМЕННУЮ APIVIDEOS_URL
const IP_APIVIDEOS = '213.109.66.172'
// ССЫЛКА НА АПИ ДЛЯ ЗАПРОСА НА ВИДЕОФАЙЛЫ
const APIVIDEOS_URL = `https://bazon.cc/api/playlist?token=${API_TOKEN}&kp=`

// ССЫЛКИ НА АПИ ДЛЯ КАЖДОЙ СТРАНИЦЫ
const APIANIME_URL = `https://bazon.cc/api/json?token=${API_TOKEN}&type=all&page=1&cat=аниме`;
const APIFILMS_URL = `https://bazon.cc/api/json?token=${API_TOKEN}&type=film&page=1&`;
const APISERIALS_URL = `https://bazon.cc/api/json?token=${API_TOKEN}&type=serial&page=1`;
const APICARTOONS_URL = `https://bazon.cc/api/json?token=${API_TOKEN}&type=film&page=1&cat=мультфильм`;
const APICOMPILATIONS_URL = `https://bazon.cc/api/json?token=${API_TOKEN}&type=all&page=1`;
const APIPREMIERES_URL = `https://bazon.cc/api/search?token=${API_TOKEN}&kp=`;
const APISEARCH_URL = `https://bazon.cc/api/search?token=${API_TOKEN}&title=`;


// Видео для премьер
const premiereVideos = ['4472721', '5072664', '4745766', '4477067', '927898', '4948912', '4383782', '4703806', '1278935', '959062', '1267348', '5106348' ,'1318866' ,'4368100' ,'4437750' ]


// ОТОБРАЖЕНИЕ ГЛАВНОЙ СТРАНИЦЫ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

// ------------------- Функция запрос для ПОЛУЧЕНИЕ ВИДЕОФАЙЛОВ -----------------------
function getMp4Videos(item, season, episode, res, pageName) {
  try {
    // ПРОВЕРКА НА СЕЗОНЫ ДЛЯ ТОГО, ЧТОБЫ ПРОВЕРЯТЬ НА СЕРИАЛ 
    if (season) {
      fetch(APIVIDEOS_URL + `${item.kinopoisk_id}&ref=&ip=${IP_APIVIDEOS}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((jsonResponse) => {
          console.log('serial', jsonResponse.results)
          // -------------------------- дальнейший код получает ссылку на видеофайл(ссылка в переменной video) -----------------------------

           // --------------------------- код для получения фильма с лучшей озвучкой ---------------------------
           const videoitemVideo = []
          jsonResponse.results.map((item) => {
            let videoItemText = videoitemVideo[0] ? false : true
            if (videoItemText && (item.translation === 'Дубляж') ) {
              videoitemVideo.push(item)
              return item.translation
            } else if (videoItemText && (item.translation === 'Многоголосый')) {
              videoitemVideo.push(item)
              return item.translation
            } else if (videoItemText && jsonResponse.results[1].translation !== 'Дубляж' && jsonResponse.results[1].translation !== 'Многоголосый'){
              videoitemVideo.push(item)
              return item.translation
            }
          })
          console.log('videoitemVideo', videoitemVideo)
          const videoPlaylist = videoitemVideo[0].playlists
          // --------------------------------------------------------------------------------------------------

          const seasonObj = videoPlaylist[`${season}`]; // получаю сезоны
          const episodeObj = seasonObj !== undefined ? seasonObj[`${episode}`] : 'no seasons' // проверка на присутствие эпизодов в запросе, если есть то получаю эпизод

          // ----- ниже делаю проверку на качество видео, чтобы давало лучшее из всех -----
          const video = episodeObj['1080'] ? episodeObj['1080'] : episodeObj['720'] ? episodeObj['720'] : episodeObj['480']
          console.log('videoURL', video)
          videoitemVideo.splice(0, videoitemVideo.length); // обнуляю массив после выбора озвучки
          // ------------------------------------------------------------------------------

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
    <div class="No episodes">
      <h1>${(episodeObj === 'no seasons') ? 'Отсутствуют эпизоды' : ''}</h1> 
    </div>
  </div>
  <script type="text/javascript">
    /* дает ссылку если есть серии, no url если нет серий и выдает что нет эпизодов если нет серий выше */
    var url = '${video ? video.toString() : 'no url'}'; 
    /* инициализация плеера */
    var stb = gSTB;
    /* обработка нажатых клавиш */
    $('html').keyup(function(e){
      if (e.keyCode === 8) {
        console.log('keydown: back');
        stb.Stop();
        window.location='/${pageName}'
      }
      if (e.keyCode === 27) {
        e.preventDefault();
        return false;
      }
      if (e.keyCode === 107) {
        console.log('keydown: volume up');
        stb.SetVolume(stb.GetVolume() + 10)
      }
      if (e.keyCode === 109) {
        console.log('keydown: volume down');
        stb.SetVolume(stb.GetVolume() - 10)
      }
      if (e.keyCode === 13) {
        if (stb.IsPlaying()) {
          console.log('keydown: stop');
          stb.Pause();
        } else {
          console.log('keydown: play');
          stb.Continue();
        }
      }
      if (e.keyCode === 37) {
        console.log('keydown: left');
        stb.SetPosTime(stb.GetPosTime() - 10)
      }
      if (e.keyCode === 39) {
        console.log('keydown: right');
        stb.SetPosTime(stb.GetPosTime() + 10)
      }
      if (e.keyCode === 192) {
        if (stb.GetMute() === 0) {
          console.log('keydown: mute');
          stb.SetMute(1)
        } else {
          console.log('keydown: unmute');
          stb.SetMute(0)
        }
      }
    })  
    stb.InitPlayer();
    stb.SetPIG(1, 1, 0, 0);
    stb.EnableServiceButton(true);
    stb.EnableVKButton(false);
    stb.SetTopWin(0);
    stb.Play(url);
  </script>
</body>
</html>`;

          res.send(playerPage); // Отправка ответа в виде HTML(setTimeout для того чтобы обновляло данные страницы)
        })
        .catch((error) => console.error("getMp4Videos1", error));
    } else {
      //console.log("фильм", requestData);
      fetch(APIVIDEOS_URL + `${item.kinopoisk_id}&ref=&ip=${IP_APIVIDEOS}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((jsonResponse) => {
          console.log('film', jsonResponse.results)
          // -------------------------- дальнейший код получает ссылку на видеофайл(ссылка в переменной video) -----------------------------
          

          // --------------------------- код для получения фильма с лучшей озвучкой ---------------------------
           const videoitemVideo = []
          jsonResponse.results.map((item) => {
            let videoItemText = videoitemVideo[0] ? false : true
            if (videoItemText && (item.translation === 'Дубляж') ) {
              videoitemVideo.push(item)
              return item.translation
            } else if (videoItemText && (item.translation === 'Многоголосый')) {
              videoitemVideo.push(item)
              return item.translation
            } else if (videoItemText && jsonResponse.results[1].translation !== 'Дубляж' && jsonResponse.results[1].translation !== 'Многоголосый'){
              videoitemVideo.push(item)
              return item.translation
            }
          })
          console.log('videoitemVideo', videoitemVideo)
          const videoPlaylist = videoitemVideo[0].playlists
          // --------------------------------------------------------------------------------------------------

          // ---- ниже делаю проверку на качество видео, чтобы давало лучшее из всех ----
          const video = videoPlaylist['1080'] ? videoPlaylist['1080'] : videoPlaylist['720'] ? videoPlaylist['720'] : videoPlaylist['480']
          console.log('videoURL', video)
          videoitemVideo.splice(0, videoitemVideo.length); // обнуляю массив после выбора озвучки
          // ----------------------------------------------------------------------------

          // -------------------- страница с плеером --------------------
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
    var url = '${video.toString()}';
    /* инициализация плеера */
    var stb = gSTB;
    /* обработка нажатых клавиш */
    $('html').keyup(function(e){
      if (e.keyCode === 8) {
        console.log('keydown: back');
        stb.Stop();
        window.location='/${pageName}'
      }
      if (e.keyCode === 27) {
        e.preventDefault();
        return false;
      }
      if (e.keyCode === 107) {
        console.log('keydown: volume up');
        stb.SetVolume(stb.GetVolume() + 10)
      }
      if (e.keyCode === 109) {
        console.log('keydown: volume down');
        stb.SetVolume(stb.GetVolume() - 10)
      }
      if (e.keyCode === 13) {
        if (stb.IsPlaying()) {
          console.log('keydown: stop');
          stb.Pause();
        } else {
          console.log('keydown: play');
          stb.Continue();
        }
      }
      if (e.keyCode === 37) {
        console.log('keydown: left');
        stb.SetPosTime(stb.GetPosTime() - 10)
      }
      if (e.keyCode === 39) {
        console.log('keydown: right');
        stb.SetPosTime(stb.GetPosTime() + 10)
      }
      if (e.keyCode === 192) {
        if (stb.GetMute() === 0) {
          console.log('keydown: mute');
          stb.SetMute(1)
        } else {
          console.log('keydown: unmute');
          stb.SetMute(0)
        }
      }
    })  
    stb.InitPlayer();
    stb.SetPIG(1, 1, 0, 0);
    stb.EnableServiceButton(true);
    stb.EnableVKButton(false);
    stb.SetTopWin(0);
    stb.Play(url);
    
  </script>
</html>`;
          // ------------------------------------------------------------
          res.send(playerPage); // Отправка ответа в виде HTML(setTimeout для того чтобы обновляло данные страницы)
        })
        .catch((error) => console.error("getMp4Videos2", error)); 
    }
  } catch (error) {
    console.error(error);
  }
}

async function getSearchedMovie() {
  try {
    //  огромный код для списка фильмов
    app.get("/searchItem", (req, res) => {
      // получение значений из url адреса(названия фильма)
      var name = req.originalUrl.split("?").pop();
      var correctName = name.replace("+", " ");
      // код для форматирования текста с пробелами из url адреса
      sParameter = decodeURIComponent(correctName);

      function fetchMovie() {
        // запрос на поиск фильмов
        fetch(APISEARCH_URL + sParameter)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            // проверка на запрос(есть ли такой фильм или нет), если нет то выводит страницу 'Ничего не найдено' 
            if (data.results) {
            const movieItem = data.results;
            // дальнейший код отображает страницу с сезонами и сериями для сериала
            movieItem.map((searchedItem, index) => {
              app.get(
                "/searchedMovieEpisodes=" + searchedItem.kinopoisk_id + index,
                (req, res) => {
                  let videos = [];
                  // --------------------------------- проверка на серии(то есть проверка на сериал) ---------------------------------
                  let videoSeasonsArrays = searchedItem.episodes
                    ? searchedItem.episodes
                    : "no episodes";
                  // -----------------------------------------------------------------------------------------------------------------
                  let episodes = [];
                  // дальнейший код для получения серий и сезонов, тк идет проверка на эпизоды, фильмы будут обрабатывать после else
                  if (videoSeasonsArrays !== "no episodes") {
                    const seasonsArr = [];
                    // получение из запроса сезонов и эпизодов
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
                    // создание объекта для того чтобы отобразить эпизоды в дальнейшем
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
                     name: '${searchedItem.info.orig.replace(/('|")/g, ``)}',
                  },
          `
                      );
                      return videoObject.join("");
                    });
                    videos.push(items.join(""));
                    // отображение страницы с плеером для определенного сериала с определенными эпизодом и сезоном
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
                              res,
                              `searchedMovieEpisodes=${searchedItem.kinopoisk_id + index}`
                            );
                          }
                        );
                      });
                    });
                    // создание файла с объектом выше для дальнейшего отображения каждой серии и сезона на странице
                    fs.writeFile(
                      "./js/searchedMovie.js",
                      `(function () {
    "use strict" // страница создана в файле index.js

    window.App.searchedMovie = [${videos}]
  })();
  `,
                      function (err) {
                        if (err) {
                          return console.log(err);
                        } // проверка на ошибку
                        // страница с сезонами и эпизодами
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
                        <script type="text/javascript" src="../js/search/videoApp.js"></script>
                        <script type="text/javascript" src="../js/searchedMovie.js"></script>
                        <script type="text/javascript" src="../js/scenes/searchedSerials.js"></script>
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
                  position: relative;
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
                  background: rgba(0, 0, 0, 0.685);
                    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
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
                .waitPopup_block {
    width: 350px;
    height: 150px;
    position: absolute;
    top: 250px;
    left: 380px;
    right: 500px;
    bottom: 500px;
    padding: 20px;
            border: 2px solid #fff;
            background: black;
        }
        .waitPopup_wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .waitPopup_wrap h1 {
          color: white;
          font-family: 'Inter', sans-serif;
        }

        .waitPopupBackground {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 5;
        }
                </style>
                
                <body>
                <div class="waitPopupBackground" id="waitPopup_bg">
        <div class="waitPopup_block" id="waitPopup_block">
            <div class="waitPopup_wrap">
                <h1>Загрузка...</h1>
            </div>
        </div>
</div>
                      <div class="selectEpisode selectEpisodeHidden navigation-items scene js-scene-serialSeasons" data-nav_loop="true">
                    </div>
                </body>
                <script type="text/javascript">
                    $('html').keyup(function(e){
      if (e.keyCode === 8) {
        /* назад */
        window.location='/search'
      }
      if (e.keyCode === 27) {
        e.preventDefault();
        return false;
      }
      if (e.keyCode === 38) {
        /* вверх */
            $('.focus').get(0).scrollIntoView();
        } else if (e.keyCode === 40) {
          /* вниз */
             $('.focus').get(0).scrollIntoView();
        }
    })  
                </script>
                </html>`;

                        setTimeout(() => res.send(episodesPage), 500) // Отправка ответа в виде HTML(setTimeout для того чтобы обновляло данные страницы)
                      }
                    );
                    
                    videos.splice(0, videos.length); // обнуляю массив чтобы не было одних и тех же серий и не было ошибки
                  } else {
                    // если фильм то сразу создаю страницу с плеером
                     getMp4Videos(
                              searchedItem,
                              ...[, ,],
                              res,
                              `searchItem?${searchedItem.info.rus}`
                            );
                  }
                }
              );
            });
            // создание объекта для отображения постеров фильмов и сериалов
            let items = movieItem.map(
              (element, index) =>
                `{
            filmPageId: 'filmid${element.kinopoisk_id + index}',
            id: '${element.kinopoisk_id + index}',
            kinopoisk_id: '${element.kinopoisk_id}',
            type: 'vod',
            imgurl: '${element.info.poster}',
            title: '${element.info.rus.replace(/('|")/g, ``)}',
            titleEng: '${element.info.orig.replace(/('|")/g, ``)}',
            created: '${element.info.year}',
            actors: '${element.info.actors.replace(/('|")/g, ``)}',
            director: '${element.info.director.replace(/('|")/g, ``)}',
            country: '${element.info.country}',
            text: '${element.info.description.replace(/[\n\r]+/g, "").replace(/('|")/g, ``).substring(0,300) + '...'}',
            status: '${element.serial === '1' ? 'serial' : 'film'}'
          },
          `
            );
            // создаю файл с объектами постеров фильмов и сериалов для отображения на странице
            fs.writeFile(
              "./js/search/resultsOfSearch.js",
              `(function () {
    "use strict" // страница создана в файле index.js

    window.App.searchedVideos = [
      ${items.join("")}
    ] 
  })();
  `,
              function () {
              // обработка тех объектов постеров для отображения на странице
                fs.writeFileSync(
                  "./js/search/searchVideosRender.js",
                  `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;

  var itemHtml = _.template('<div data-content="filmInfo" data-film="{{filmPageId}}" data-id="{{id}}" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;" class="movieitem navigation-item nav-item" data-type="{{type}}"><h4 class="mainMovieTitle">{{title}}</h4></div>');
  
  // создание сцены с постерами
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
        $('.bg').hide();
        $('.bg2').show();
        $(".header").hide();
        window.App.showContent(scene); // показать сцену с информацией о фильме
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
                // создаю файл с информацией о фильме
                fs.writeFileSync(
                  "./js/search/searchFilmInfo.js",
                  `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  
  // в конце переменной скрипт для перехода на страницу с сезонами и сериями
  var filmPageHtml = _.template('<div id="{{filmPageId}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><div class="poster_blockImg" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;"></div><div class="film-dscrtn"><div><p class="actors">Актеры: {{actors}}</p><p>Страна: {{country}}</p><p>Год:{{created}}</p><p>Режиссер:{{director}}</p></div><h2 id="videotitle">{{title}}</h2></div></div><p class="description">{{text}}</p></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo"><img width="250" height="70" src="./images/UconCinemaLogo.png" alt="logoimg"></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><img width="30" src="./images/arrowBack.svg" alt="arrow" /> Назад</li><li class="menu-item nav-item watchBtn" id="{{id}}"><h4>Смотреть</h4></li></ul></nav></div></div></div><script>var watchBtn = document.getElementById("{{id}}"); if("{{status}}" === "film") {watchBtn.addEventListener("click", function (event) {document.location.href = "/searchedMovieEpisodes={{id}}"; $("#waitPopup_bg").show();$$nav.off()})} else {watchBtn.addEventListener("click", function (event) {document.location.href = "/searchedMovieEpisodes={{id}}"});}</script>');
 
  // создание сцены с информацией о фильме
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
    `
                );
              }
            );
            // создаю файл с обработкой сезонов и серий
            fs.writeFileSync(
              "./js/search/searchedEpisodesOfFilm.js",
              `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;

  // в конце переменной скрипт для перехода на страницу с плеером
  var seasonItems = _.template('<div id="{{id}}" data-content="serialSeasons" class="episodeBlock navigation-item nav-item" data-season="{{season}}" data-episode="{{episode}}"><h4>{{season}}</h4><p>{{episode}}</p></div><script>var selectEpisode = document.getElementById("{{id}}"); selectEpisode.addEventListener("click", function (event) {document.location.href = "/player={{id}}"; $("#waitPopup_bg").show();$$nav.off()});</script>')
  
  // создание сцены с сезонами и сериями
  window.App.scenes.SerialSeasons = {
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
            // страница с постерами и информацией о фильмах
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
   position:relative;
    margin: 0;
    padding: 0;
    height: 100%;
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
.header img {
    cursor: pointer;
}
.header {
  display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
}
.header h2 {
    font-size: 35px;
    border-left: 2px solid white;
}
.header .focus {
    border-bottom: 5px solid rgb(207, 178, 14);
    margin-bottom: -5px;
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
    border: 5px solid rgb(207, 178, 14);
    padding: 5px;
}
.js-scene-video .focus {
  border: 5px solid rgb(207, 178, 14);
  padding: 5px;
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


 .focus .mainMovieTitle{
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
  max-width: 60%;
}

.logo_text h4 {
    margin: 0;
    color: #fff;
}
.film-main {
    padding: 20px;
    display: flex;
    flex-direction: column;
}
.film-info {
    display: flex;
}
.poster_blockImg {
  width: 300px;
  height: 380px;
  margin: 0 30px 30px 0;
}
.film-info img {
    object-fit: cover;
    height: 400px;
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
    max-width: 50%;
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
    background: rgba(0, 0, 0, 0.685);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
    width: 30%;
    height: 100vh;
}
.film-nav .focus {
  background-color: #290452;
}
.film-nav_logo {
    
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.back {
  display: flex;
  align-items: center;
    font-size: 22px;
        padding: 30px;
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

.bg {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url(./images/stars.png);
            z-index: -1;
        }
.bg2 {
          display: none;
          position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            background-image: url(./images/stars.png);
            z-index: -1;
}
.log-row {
  color: white;
  font-size: 24px;
}
    .waitPopup_block {
    width: 350px;
    height: 100px;
    position: absolute;
    top: 270px;
    left: 410px;
    right: 470px;
    bottom: 480px;
    padding: 20px;
            background: rgba(0, 0, 0, 0.685);
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }
        .waitPopup_wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .waitPopupBackground {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 5;
        }

</style>
<body>

<div class="bg"></div>
<div class="bg2"></div>
<div class="waitPopupBackground" id="waitPopup_bg">
        <div class="waitPopup_block" id="waitPopup_block">
            <div class="waitPopup_wrap">
                <h1>Загрузка...</h1>
            </div>
        </div>
</div>
<div id="app" class="wrap">
      <div class="header navigation-items">
                <img class="navigation-item nav-item" width="30px" height="30px" src="./images/arrowBack.svg" alt="back" id="img_back">
                <h2>Результаты поиска</h2>
    </div>
    <div id="movies" class="navbar navigation-items scene scene_video js-scene-video" data-nav_loop="true">
    </div>
    <div class="scene scene_filmInfo film-container js-scene-filmInfo" data-nav_loop="true">
    </div>
    </div>
    <script type='text/javascript'>
    /* обработка нажатых клавиш */
     $('html').keyup(function(e){
      if (e.keyCode === 8) {
        /* назад */
        window.location='/search'
      }
      if (e.keyCode === 27) {
        e.preventDefault();
        return false;
      }
      if (e.keyCode === 38) {
        /* вверх */
            $('.focus').get(0).scrollIntoView();
        } else if (e.keyCode === 40) {
          /* вниз */
             $('.focus').get(0).scrollIntoView();
        }
    })  
    /* переход назад */
    $('#img_back').click(function() {
      window.location = '/search'
    })
    </script>
</body>
</html>`;

            res.send(message); // Отправка ответа в виде HTML
            } else {
              // страница ничего не найдено
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
        <script type="text/javascript" src="./js/scenes/navigation.js"></script>
  
</head>

<style>

body {
    position: relative;
    margin: 0;
    padding: 0;
    height: 100%;
}


.wrap {
  display:flex;
    align-items: center;
    justify-content: center;
    max-width: 1000px;
    margin: 0 auto;
    padding: 30px;
}
a {
    text-decoration: none;
}

h1 {
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    margin: 10px 0;
}
.bg {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url(./images/stars.png);
            z-index: -1;
        }
        .bg2 {
          display: none;
          position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            background-image: url(./images/stars.png);
            z-index: -1;
}
.error {
  display:flex;
  align-items: center;
  margin-top: 25%;
}
#img_back {
  margin-right: 20px;
}
.focus {
  border-bottom: 2px solid yellow;
}
</style>
<body>

<div class="bg"></div>
<div class="bg2"></div>
<div id="app" class="wrap">
    <div class="error">
    <img class="navigation-item nav-item" width="70px" height="70px" src="./images/arrowBack.svg" alt="back" id="img_back">
    <h1>Ничего не найдено</h1>
    </div>
</div>
    <script type='text/javascript'>
         
    $('html').keyup(function (e) {
        if (e.keyCode === 8) {
            window.location = '/search'
        }
        if (e.keyCode === 27) {
        e.preventDefault();
        return false;
      }
    })
      $('#img_back').click(function () {
        window.location = '/search'
    })
    </script>
</body>
</html>`;

            res.send(message); // Отправка ответа в виде HTML
            }
          })
          .catch((err) => console.error("getSearchedMovie", err));
      }
      fetchMovie();
    });
  } catch (error) {
    console.error(error);
  }
}
// функция для страницы с полем ввода(поиск)
async function searchPage() {
  try {
    app.get("/search", (req, res) => {
      getSearchedMovie();
      // страница с полем ввода
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
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url(./images/stars.png);
            z-index: -1;
        }
        .bg2 {
          display: none;
          position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            background-image: url(./images/stars.png);
            z-index: -1;
}
        .searchBlock {
            position: absolute;
            top: 40%;
            right: 70%;
            left: 30%;
            bottom: 60%;
            width: 550px;
        }
        .searchBlock-container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px;
            background: rgba(0, 0, 0, 0.685);
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }
        .search-input {
            position: relative;
            margin-right: 10px;
            width: 450px;
            height: 40px;
            padding: 0 10px 0 10px;
            border: 1px solid white;
            border-radius: 5px;
            margin-top: 10px;
            color: white;
            font-size: 24px;
            display:flex;
            align-items:center;
            background-color: #290452;
        } 
        .search-button {
            position: relative;
            background-color: #290452;
            padding: 5px;
            color: white;
            border: 1px solid white;
            border-radius: 3px;
            margin-top: 10px;
        }
.searchBlock-container .focus {
  border: 1px solid yellow;
}
.clickOk {
  position: absolute;
  top: 5px;
  color: rgba(165, 165, 165, 0.582);
}
.searchImg {
  margin-left: 3px;
  opacity: 0.5;
  margin-top: 10px;
}
</style>
<body>

<div class="bg"></div>
<div class="bg2"></div>
<div id="app" class="app wrap">
       <div class="searchBlock">
            <div class="scene js-scene-input navigation-items searchBlock-container" data-nav_loop="true">
            <span class="clickOk">Нажмите кнопку "OK" для вызова клавиатуры</span>
                <input type="text" id="input" class="nav-item search-input input-item" name="input"
                    placeholder="Please enter your task">
                <button type="button" id="inputBtn" class="navigation-item nav-item search-button">Поиск</button>
            <img class="searchImg" width="26px" height="25px" src="./images/1212.png" alt="info" id="img_info">
            </div>
        </div>
</div>
<script type="text/javascript">
    var inputElem = document.getElementById("input");
   
    $('#input')
        .SBInput({
            keyboard: {
                type: 'fulltext_ru_nums'
            }
        });
      var bla
      $('html').keyup(function(e) {
        bla = inputElem.getAttribute('data-value') // get the current value of the input field.
        $('button#inputBtn.focus').on('click', function() {
          window.location = '/searchItem?' + bla
      });
      if (e.keyCode === 89) {
        window.location = '/searchItem?' + bla
      }
      });

      $('html').keyup(function(e){
      if (e.keyCode === 8) {
        /* назад */
        window.location='/'
      }
      if (e.keyCode === 27) {
        e.preventDefault();
        return false;
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


 async function getPremieres() {
  try {
    
    
    // ---- задержка для базона, чтобы отдавал данные, а то блочит ----
    const fetchItemsPremieres = []
    var i = 0;
    function loopIt(i) {
  setTimeout(function(){
    // запрос на получение фильмов
      fetch(APIPREMIERES_URL + premiereVideos[i])
          .then((response) => {
            return response.text();
          }).then(jsonResponse => {
            const data2 = JSON.parse(jsonResponse)
            if (data2.results.length > 1) { 
            const data3 = []
            data2.results.map((item) => {
            let ItemText = data3[0] ? false : true
            if (ItemText && (item.translation === 'Дубляж') ) {
              data3.push(item)
              fetchItemsPremieres.push([item])
              return item.translation
            } else if (ItemText && (item.translation === 'Многоголосый')) {
              data3.push(item)
              fetchItemsPremieres.push([item])
              return item.translation
            } else if (ItemText && data2.results[1].translation !== 'Дубляж' && data2.results[1].translation !== 'Многоголосый'){
              data3.push(item)
              fetchItemsPremieres.push([item])
              return item.translation
            }
          })
            } else fetchItemsPremieres.push(data2.results)
          })
          .catch((err) => console.error("ошибка", err))
      if(i < premiereVideos.length - 1)  loopIt(i+1)
    }, 180);
}(i)
loopIt(i)
    // ---------------------------------------------------------------------

    app.get("/premieres", (req, res) => {
      setTimeout(() => {
        let fetchData = fetchItemsPremieres
 const showFilms = async () => {
        try {
          let items = fetchData.map(
            (element) =>
              `{
            id: '${element[0].kinopoisk_id}',
            type: 'vod',
            imgurl: '${element[0].info.poster}',
            title: '${element[0].info.rus.replace(/('|")/g, ``)}',
            titleEng: '${element[0].info.orig.replace(/('|")/g, ``)}',
            created: '${element[0].info.year}',
            filmPageId: 'filmid${element[0].kinopoisk_id}',
            actors: '${element[0].info.actors.replace(/('|")/g, ``)}',
            director: '${element[0].info.director.replace(/('|")/g, ``)}',
            country: '${element[0].info.country}',
            text: '${element[0].info.description.replace(/[\n\r]+/g, "").replace(/('|")/g, ``).substring(0,300) + '...'}',
            status: '${element[0].serial === '1' ? 'serial' : 'film'}'
          },
          `
          );
          return items;
        } catch (error) {
          console.error(error);
        }
  };
   const fetchVideosPremieres = async () => {
        try {
          let videosId = fetchData;
          // дальнейший код отображает страницу с сезонами и сериями для сериала
          videosId.map((item) => {
            let videos = [];
            // --------------------------------- проверка на серии(то есть проверка на сериал) ---------------------------------
            let videoSeasonsArrays = item[0].episodes
              ? item[0].episodes
              : "no episodes";
            // -----------------------------------------------------------------------------------------------------------------
            app.get("/selectepisodeIdPremieres=" + item[0].kinopoisk_id, (req, res) => {
              let episodes = [];
              // дальнейший код для получения серий и сезонов, тк идет проверка на эпизоды, фильмы будут обрабатывать после else
              if (videoSeasonsArrays !== "no episodes") {
                const seasonsArr = [];
                 // получение из запроса сезонов и эпизодов
                for (let key of Object.keys(item[0].episodes)) {
                  const episodesArr = [];
                  seasonsArr.push(key);
                  for (let value of Object.values(item[0].episodes[key])) {
                    episodesArr.push(value);
                  }
                  episodes.push(episodesArr);
                }
                // создание объекта для того чтобы отобразить эпизоды в дальнейшем
                let items = episodes.map((value, seasonIndex) => {
                  let videoObject = value.map(
                    (element, episodeIndex) =>
                      `{
                     season: '${seasonIndex + 1}' + 'сезон',
                     episode: '${episodeIndex + 1}' + 'серия',
                     seasonNum: '${seasonIndex + 1}',
                     episodeNum: '${episodeIndex + 1}', 
                     id: '${item[0].kinopoisk_id}&${seasonIndex + 1}&${
                        episodeIndex + 1
                      }',
                     name: '${item[0].info.orig.replace(/('|")/g, ``)}',
                  },
          `
                  );
                  return videoObject.join("");
                });
                videos.push(items.join(""));
                 // отображение страницы с плеером для определенного сериала с определенными эпизодом и сезоном
                episodes.map((value, seasonIndex) => {
                  value.map((element, episodeIndex) => {
                    app.get(
                      "/player=" +
                        item[0].kinopoisk_id +
                        `&${seasonIndex + 1}&${episodeIndex + 1}`,
                      (req, res) => {
                        getMp4Videos(
                          item[0],
                          seasonIndex + 1,
                          episodeIndex + 1,
                          res,
                          `selectepisodeIdPremieres=${item[0].kinopoisk_id}`
                        );
                      }
                    );
                  });
                });
                // создание файла с объектом выше для дальнейшего отображения каждой серии и сезона на странице
                fs.writeFile(
                  "./js/pagesFunctions/premieres/serialSeasons.js",
                  `(function () {
    "use strict" // страница создана в файле index.js

    window.App.SerialSeasons = [${videos}]
  })();
  `,
                  function (err) {
                    if (err) {
                      return console.log(err);
                    } // проверка на ошибку
                    // страница с сезонами и эпизодами
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
        <script type="text/javascript" src="../js/pagesFunctions/premieres/videoApp.js"></script>
        <script type="text/javascript" src="../js/pagesFunctions/premieres/serialSeasons.js"></script>
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
  position: relative;
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
  max-width: 980px;
  width: auto;
  min-height: 300px
  height: auto;
  background: rgba(0, 0, 0, 0.685);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
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
  width: 130px;
  height: 30px;
  margin-right: 10px;
  margin-bottom: 3px;
  margin-top: 3px;
  border-radius: 5px;

}
.episodeBlock h4 {
  font-weight: bold;
  margin-right: 3px;
}
    .waitPopup_block {
    width: 350px;
    height: 100px;
    position: absolute;
    top: 270px;
    left: 410px;
    right: 470px;
    bottom: 480px;
    padding: 20px;
            background: rgba(0, 0, 0, 0.685);
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }
        .waitPopup_wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .waitPopupBackground {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 5;
        }
        .waitPopup_wrap h1 {
          color: white;
          font-family: 'Inter', sans-serif;
        }
        </style>

<body>
<div class="waitPopupBackground" id="waitPopup_bg">
        <div class="waitPopup_block" id="waitPopup_block">
            <div class="waitPopup_wrap">
                <h1>Загрузка...</h1>
            </div>
        </div>
</div>
      <div class="selectEpisode selectEpisodeHidden navigation-items scene js-scene-serialSeasons" data-nav_loop="true">
    </div>
</body>
<script type="text/javascript">
    $('html').keyup(function(e){
      if (e.keyCode === 8) {
        /* назад */
        window.location='/premieres'
      }
      if (e.keyCode === 38) {
        /* вверх */
            $('.focus').get(0).scrollIntoView();
        } else if (e.keyCode === 40) {
          /* вниз */
             $('.focus').get(0).scrollIntoView();
        }
    })  
</script>
</html>`;
                    setTimeout(() => res.send(episodesPage), 500) // Отправка ответа в виде HTML(setTimeout для того чтобы обновляло данные страницы)
                  }
                );
                videos.splice(0, videos.length); // обнуляю массив чтобы не было одних и тех же серий и не было ошибки
              } else {
                // если фильм то сразу создаю страницу с плеером
                getMp4Videos(item[0], ...[, ,], res, 'premieres');
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
        const movieItems = movies.join('');
        // создаю файл с объектами постеров для отображения на странице
        fs.writeFileSync(
          "./js/pagesFunctions/premieres/videos.js",
          `(function () {
    "use strict" // страница создана в файле index.js

    window.App.videos = [
      ${movieItems}
    ] 
  })();
  `
        );
        // создаю файл для каждого фильма с информацией о фильме
        fs.writeFileSync(
          "./js/pagesFunctions/premieres/FilmPage.js",
          `(function () {
    "use strict" // страница создана в файле index.js

    window.App.filmInfo = [
      ${movieItems}
    ] 
  })();
  `
        );
      }

      sendFilms();
      // обработка тех объектов постеров для отображения на странице
      fs.writeFileSync(
        "./js/scenes/videosRender.js",
        `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  var itemHtml = _.template('<div data-content="filmInfo" data-film="{{filmPageId}}" data-id="{{id}}" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;" class="movieitem navigation-item nav-item" data-type="{{type}}"><h4 class="mainMovieTitle">{{title}}</h4></div>');
    
  // создание сцены с постерами
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
        $('.bg').hide();
      $('.bg2').show();
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
      // создаю файл с информацией о фильме
      fs.writeFileSync(
        "./js/scenes/filmInfo.js",
        `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
    // в конце переменной скрипт для перехода на страницу с сезонами и сериями
  var filmPageHtml = _.template('<div id="{{filmPageId}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><div class="poster_blockImg" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;"></div><div class="film-dscrtn"><div><p class="actors">Актеры: {{actors}}</p><p>Страна: {{country}}</p><p>Год:{{created}}</p><p>Режиссер:{{director}}</p></div><h2 id="videotitle">{{title}}</h2></div></div><p class="description">{{text}}</p></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo"><img width="250" height="70" src="./images/UconCinemaLogo.png" alt="logoimg"></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><img width="30" src="./images/arrowBack.svg" alt="arrow" /> Назад</li><li class="menu-item nav-item watchBtn" id="{{id}}"><h4>Смотреть</h4></li></ul></nav></div></div></div><script>var watchBtn = document.getElementById("{{id}}");  if("{{status}}" === "film") {watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeIdPremieres={{id}}"; $("#waitPopup_bg").show();$$nav.off()})} else {watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeIdPremieres={{id}}"});}</script>');
  
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
    `
      );
      // создаю файл с обработкой сезонов и серий
      fs.writeFileSync(
        "./js/scenes/filmSeasons.js",
        `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
 //  в конце переменной скрипт для перехода на страницу с плеером
  var seasonItems = _.template('<div id="{{id}}" data-content="serialSeasons" class="episodeBlock navigation-item nav-item" data-season="{{season}}" data-episode="{{episode}}"><h4>{{season}}</h4><p>{{episode}}</p></div><script>var selectEpisode = document.getElementById("{{id}}"); selectEpisode.addEventListener("click", function (event) {document.location.href = "/player={{id}}"; $("#waitPopup_bg").show();$$nav.off()});</script>')
  
  // создание сцены с сезонами и сериями
  window.App.scenes.SerialSeasons = {
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
      fetchVideosPremieres();
       
      
      // отображение страницы премьеры
    // создание главной страницы
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
        <script type="text/javascript" src="./js/pagesFunctions/premieres/FilmPage.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/premieres/videos.js"></script>
        <script type="text/javascript" src="./js/scenes/videosRender.js"></script>
        <script type="text/javascript" src="./js/scenes/filmInfo.js"></script>
        <script type="text/javascript" src="./js/scenes/navigation.js"></script>
  
</head>

<style>

body {
  position:relative;
    margin: 0;
    padding: 0;
    height: 100%;
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
   border: 5px solid rgb(207, 178, 14);
   
    padding: 5px;
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


 .focus .mainMovieTitle{
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
    justify-content: space-between;
    max-width: 1200px;
}
.header li {
    list-style-type: none;
    color: #fff;    
    font-size: 23px;
}
.header h2 {
    font-size: 35px;
    border-left: 2px solid white;
}
.header .focus {
    border-bottom: 5px solid rgb(207, 178, 14);
    margin-bottom: -5px;
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
  max-width: 60%;
}

.logo_text h4 {
    margin: 0;
    color: #fff;
}
.film-main {
    padding: 20px;
    display: flex;
    flex-direction: column;
}
.film-info {
    display: flex;
}
.poster_blockImg {
  width: 300px;
  height: 380px;
  margin: 0 30px 30px 0;}
.film-info img {
    object-fit: cover;
    height: 400px;
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
    max-width: 50%;
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
    background: rgba(0, 0, 0, 0.685);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
    width: 30%;
    height: 100vh;
}
.film-nav .focus {
  background-color: #290452;
}
.film-nav_logo {
    
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.back {
  display: flex;
  align-items: center;
    font-size: 22px;
        padding: 30px;
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

.js-scene-video .focus {
    border: 5px solid rgb(207, 178, 14);
    padding: 5px;
}
.bg {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url(./images/stars.png);
            z-index: -1;
        }
        .bg2 {
          display: none;
          position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            background-image: url(./images/stars.png);
            z-index: -1;
}
.log-row {
  color: white;
  font-size: 24px;
}
    .waitPopup_block {
    width: 350px;
    height: 100px;
    position: absolute;
    top: 270px;
    left: 410px;
    right: 470px;
    bottom: 480px;
    padding: 20px;
            background: rgba(0, 0, 0, 0.685);
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }
        .waitPopup_wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .waitPopupBackground {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 5;
        }


</style>
<body>

<div class="bg"></div>
<div class="bg2"></div>
<div class="waitPopupBackground" id="waitPopup_bg">
        <div class="waitPopup_block" id="waitPopup_block">
            <div class="waitPopup_wrap">
                <h1>Загрузка...</h1>
            </div>
        </div>
</div>
<div id="app" class="wrap">
        <div class="header navigation-items">
                <img class="navigation-item nav-item" width="30px" height="30px" src="./images/arrowBack.svg" alt="back" id="img_back">
                <h2>Премьеры</h2>
    </div>
    <div id="movies" class="navbar navigation-items scene scene_video js-scene-video" data-nav_loop="true">
    </div>
    <div class="scene scene_filmInfo film-container js-scene-filmInfo" data-nav_loop="true">
    </div>
    </div>
    <script type='text/javascript'>

      var backBtn = document.getElementById('img_back');
     $('#img_back').click(function() {
      window.location = '/'
    })
     $('html').keyup(function(e){
      if (e.keyCode === 8) {
        /* назад */
        window.location='/'
      }
      if (e.keyCode === 27) {
        e.preventDefault();
        return false;
      }
      if (e.keyCode === 38) {
        /* вверх */
            $('.focus').get(0).scrollIntoView();
        } else if (e.keyCode === 40) {
          /* вниз */
             $('.focus').get(0).scrollIntoView();
        }
    })  

    </script>
</body>
</html>`;
res.send(message)}, 2700) // Отправка ответа в виде HTML(setTimeout для того чтобы обновляло данные страницы СТАВИТЬ В ЗАВИСИМОСТИ ОТ КОЛИЧЕСТВА ФИЛЬМОВ) очень важно!!! 
})
   
  } catch (error) {
    console.error(error);
  }
}
getPremieres()
// ------------------- функция со всем функционалом Anime страницы -----------------------
async function getAnime() {
  try {
      // ----------------------- Делаем запрос для получения списка фильмов или сериалов -----------------------
      const fetchData = fetch(APIANIME_URL).then((response) => {
        return response.json();
      }).catch((err) => console.error(err));

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
            title: '${element.info.rus.replace(/('|")/g, ``)}',
            titleEng: '${element.info.orig.replace(/('|")/g, ``)}',
            created: '${element.info.year}',
            filmPageId: 'filmid${element.kinopoisk_id}',
            actors: '${element.info.actors.replace(/('|")/g, ``)}',
            director: '${element.info.director.replace(/('|")/g, ``)}',
            country: '${element.info.country}',
            text: '${element.info.description.replace(/[\n\r]+/g, "").replace(/('|")/g, ``).substring(0,300) + '...'}',
            status: '${element.serial === '1' ? 'serial' : 'film'}'
          },
          `
          );
          
          return items;
        } catch (error) {
          console.error(error);
        }
      };
      // ----------------------- функция сезонов и эпизодов для фильмов или сериалов -----------------------
      const fetchVideosAnime = async () => {
        try {
          const videosId = await fetchData;
          // дальнейший код отображает страницу с сезонами и сериями для сериала
          videosId.results.map((item) => {
            let videos = [];
            // --------------------------------- проверка на серии(то есть проверка на сериал) ---------------------------------
            let videoSeasonsArrays = item.episodes
              ? item.episodes
              : "no episodes";
            // -----------------------------------------------------------------------------------------------------------------
            app.get("/selectepisodeIdAnime=" + item.kinopoisk_id, (req, res) => {
              let episodes = [];
              // дальнейший код для получения серий и сезонов, тк идет проверка на эпизоды, фильмы будут обрабатывать после else
              if (videoSeasonsArrays !== "no episodes") {
                const seasonsArr = [];
                 // получение из запроса сезонов и эпизодов
                for (let key of Object.keys(item.episodes)) {
                  const episodesArr = [];
                  seasonsArr.push(key);
                  for (let value of Object.values(item.episodes[key])) {
                    episodesArr.push(value);
                  }
                  episodes.push(episodesArr);
                }
                // создание объекта для того чтобы отобразить эпизоды в дальнейшем
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
                     name: '${item.info.orig.replace(/('|")/g, ``)}',
                  },
          `
                  );
                  return videoObject.join("");
                });
                videos.push(items.join(""));
                 // отображение страницы с плеером для определенного сериала с определенными эпизодом и сезоном
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
                          res,
                          `selectepisodeIdAnime=${item.kinopoisk_id}`
                        );
                      }
                    );
                  });
                });
                // создание файла с объектом выше для дальнейшего отображения каждой серии и сезона на странице
                fs.writeFile(
                  "./js/pagesFunctions/anime/serialSeasons.js",
                  `(function () {
    "use strict" // страница создана в файле index.js

    window.App.SerialSeasons = [${videos}]
  })();
  `,
                  function (err) {
                    if (err) {
                      return console.log(err);
                    } // проверка на ошибку
                    // страница с сезонами и эпизодами
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
        <script type="text/javascript" src="../js/pagesFunctions/anime/videoApp.js"></script>
        <script type="text/javascript" src="../js/pagesFunctions/anime/serialSeasons.js"></script>
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
  position: relative;
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
  max-width: 980px;
  width: auto;
  min-height: 300px
  height: auto;
  background: rgba(0, 0, 0, 0.685);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
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
  width: 130px;
  height: 30px;
  margin-right: 10px;
  margin-bottom: 3px;
  margin-top: 3px;
  border-radius: 5px;

}
.episodeBlock h4 {
  font-weight: bold;
  margin-right: 3px;
}
    .waitPopup_block {
    width: 350px;
    height: 100px;
    position: absolute;
    top: 270px;
    left: 410px;
    right: 470px;
    bottom: 480px;
    padding: 20px;
            background: rgba(0, 0, 0, 0.685);
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }
        .waitPopup_wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .waitPopupBackground {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 5;
        }
        .waitPopup_wrap h1 {
          color: white;
          font-family: 'Inter', sans-serif;
        }
</style>

<body>
<div class="waitPopupBackground" id="waitPopup_bg">
        <div class="waitPopup_block" id="waitPopup_block">
            <div class="waitPopup_wrap">
                <h1>Загрузка...</h1>
            </div>
        </div>
</div>
      <div class="selectEpisode selectEpisodeHidden navigation-items scene js-scene-serialSeasons" data-nav_loop="true">
    </div>
</body>
<script type="text/javascript">
    $('html').keyup(function(e){
      if (e.keyCode === 8) {
        /* назад */
        window.location='/anime'
      }
      if (e.keyCode === 27) {
        e.preventDefault();
        return false;
      }
      if (e.keyCode === 38) {
        /* вверх */
            $('.focus').get(0).scrollIntoView();
        } else if (e.keyCode === 40) {
          /* вниз */
             $('.focus').get(0).scrollIntoView();
        }
    })  
</script>
</html>`;
                    setTimeout(() => res.send(episodesPage), 500) // Отправка ответа в виде HTML(setTimeout для того чтобы обновляло данные страницы)
                  }
                );
                videos.splice(0, videos.length); // обнуляю массив чтобы не было одних и тех же серий и не было ошибки
              } else {
                // если фильм то сразу создаю страницу с плеером
                getMp4Videos(item, ...[, ,], res, 'anime');
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
        // создаю файл с объектами постеров для отображения на странице
        fs.writeFileSync(
          "./js/pagesFunctions/anime/videos.js",
          `(function () {
    "use strict" // страница создана в файле index.js

    window.App.videos = [
      ${movieItems}
    ] 
  })();
  `
        );
         // создаю файл для каждого фильма с информацией о фильме
        fs.writeFileSync(
          "./js/pagesFunctions/anime/FilmPage.js",
          `(function () {
    "use strict" // страница создана в файле index.js
 
    window.App.filmInfo = [
      ${movieItems}
    ] 
  })();
  `
        );
      }

      sendFilms();
       // обработка тех объектов постеров для отображения на странице 
      fs.writeFileSync(
        "./js/scenes/videosRender.js",
        `(function () {
  var _inited;// страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  var itemHtml = _.template('<div data-content="filmInfo" data-film="{{filmPageId}}" data-id="{{id}}" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;" class="movieitem navigation-item nav-item" data-type="{{type}}"><h4 class="mainMovieTitle">{{title}}</h4></div>');
    
  // создание сцены с постерами
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
        $('.bg').hide();
      $('.bg2').show();
        $(".header").hide();
        window.App.showContent(scene);  // показать сцену с информацией о фильме
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
      // создаю файл с информацией о фильме
      fs.writeFileSync(
        "./js/scenes/filmInfo.js",
        `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  // в конце переменной скрипт для перехода на страницу с сезонами и сериями
  var filmPageHtml = _.template('<div id="{{filmPageId}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><div class="poster_blockImg" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;"></div><div class="film-dscrtn"><div><p class="actors">Актеры: {{actors}}</p><p>Страна: {{country}}</p><p>Год:{{created}}</p><p>Режиссер:{{director}}</p></div><h2 id="videotitle">{{title}}</h2></div></div><p class="description">{{text}}</p></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo"><img width="250" height="70" src="./images/UconCinemaLogo.png" alt="logoimg"></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><img width="30" src="./images/arrowBack.svg" alt="arrow" /> Назад</li><li class="menu-item nav-item watchBtn" id="{{id}}"><h4>Смотреть</h4></li></ul></nav></div></div></div><script>var watchBtn = document.getElementById("{{id}}");  if("{{status}}" === "film") {watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeIdAnime={{id}}"; $("#waitPopup_bg").show();$$nav.off()})} else {watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeIdAnime={{id}}"});}</script>');
  
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
    `
      );
      // создаю файл с обработкой сезонов и серий
      fs.writeFileSync(
        "./js/scenes/filmSeasons.js",
        `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
 //  в конце переменной скрипт для перехода на страницу с плеером
  var seasonItems = _.template('<div id="{{id}}" data-content="serialSeasons" class="episodeBlock navigation-item nav-item" data-season="{{season}}" data-episode="{{episode}}"><h4>{{season}}</h4><p>{{episode}}</p></div><script>var selectEpisode = document.getElementById("{{id}}"); selectEpisode.addEventListener("click", function (event) {document.location.href = "/player={{id}}"; $("#waitPopup_bg").show();$$nav.off()});</script>')
  
  // создание сцены с сезонами и сериями
  window.App.scenes.SerialSeasons = {
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
      
      fetchVideosAnime();
     
  } catch (error) {
    console.error(error);
  }
}
// отображение страницы аниме
 app.get("/anime", (req, res) => { 
    getAnime()
    // создание главной страницы
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
        <script type="text/javascript" src="./js/pagesFunctions/anime/FilmPage.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/anime/videos.js"></script>
        <script type="text/javascript" src="./js/scenes/videosRender.js"></script>
        <script type="text/javascript" src="./js/scenes/filmInfo.js"></script>
        <script type="text/javascript" src="./js/scenes/navigation.js"></script>
  
</head>

<style>

body {
  position:relative;
    margin: 0;
    padding: 0;
    height: 100%;
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
    border: 5px solid rgb(207, 178, 14);
    padding: 5px;
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


 .focus .mainMovieTitle{
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
    justify-content: space-between;
    max-width: 1200px;
}
.header li {
    list-style-type: none;
    color: #fff;    
    font-size: 23px;
}
.header h2 {
    font-size: 35px;
    border-left: 2px solid white;
}
.header .focus {
    border-bottom: 5px solid rgb(207, 178, 14);
    margin-bottom: -5px;
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
  max-width: 60%;
}

.logo_text h4 {
    margin: 0;
    color: #fff;
}
.film-main {
    padding: 20px;
    display: flex;
    flex-direction: column;
}
.film-info {
    display: flex;
}
.poster_blockImg {
  width: 300px;
  height: 380px;
  margin: 0 30px 30px 0;}
.film-info img {
    object-fit: cover;
    height: 400px;
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
    max-width: 50%;
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
    background: rgba(0, 0, 0, 0.685);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
    width: 30%;
    height: 100vh;
}
.film-nav .focus {
  background-color: #290452;
}
.film-nav_logo {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.back {
  display: flex;
  align-items: center;
    font-size: 22px;
        padding: 30px;
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

.js-scene-video .focus {
    border: 5px solid rgb(207, 178, 14);
    padding: 5px;
}
.bg {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url(./images/stars.png);
            z-index: -1;
        }
        .bg2 {
          display: none;
          position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            background-image: url(./images/stars.png);
            z-index: -1;
}
.log-row {
  color: white;
  font-size: 24px;
}

 .waitPopup_block {
    width: 350px;
    height: 100px;
    position: absolute;
    top: 270px;
    left: 410px;
    right: 470px;
    bottom: 480px;
    padding: 20px;
            background: rgba(0, 0, 0, 0.685);
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }
        .waitPopup_wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .waitPopupBackground {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 5;
        }

</style>
<body>

<div class="bg"></div>
<div class="bg2"></div>
<div class="waitPopupBackground" id="waitPopup_bg">
        <div class="waitPopup_block" id="waitPopup_block">
            <div class="waitPopup_wrap">
                <h1>Загрузка...</h1>
            </div>
        </div>
</div>
<div id="app" class="wrap">
        <div class="header navigation-items">
                <img class="navigation-item nav-item" width="30px" height="30px" src="./images/arrowBack.svg" alt="back" id="img_back">
                <h2>Аниме</h2>
    </div>
    <div id="movies" class="navbar navigation-items scene scene_video js-scene-video" data-nav_loop="true">
    </div>
    <div class="scene scene_filmInfo film-container js-scene-filmInfo" data-nav_loop="true">
    </div>
    </div>
    <script type='text/javascript'>

    $('#img_back').click(function() {
      window.location = '/'
    })
    $('html').keyup(function(e){
      if (e.keyCode === 8) {
        /* назад */
        window.location='/'
      }
      if (e.keyCode === 27) {
        e.preventDefault();
        return false;
      }
      if (e.keyCode === 38) {
        /* вверх */
            $('.focus').get(0).scrollIntoView();
        } else if (e.keyCode === 40) {
          /* вниз */
             $('.focus').get(0).scrollIntoView();
        }
    })  
    </script>
</body>
</html>`;
      setTimeout(() => res.send(message), 500) // Отправка ответа в виде HTML(setTimeout для того чтобы обновляло данные страницы) (таймаут нужен для ожидания подгрузки фильмов или сериалов)
 })

// ------------------- функция со всем функционалом films страницы -----------------------
async function getFilms() {
  try {
      // ----------------------- Делаем запрос для получения списка фильмов или сериалов -----------------------
      const fetchData = fetch(APIFILMS_URL)
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
            title: '${element.info.rus.replace(/('|")/g, ``)}',
            titleEng: '${element.info.orig.replace(/('|")/g, ``)}',
            created: '${element.info.year}',
            filmPageId: 'filmid${element.kinopoisk_id}',
            actors: '${element.info.actors.replace(/('|")/g, ``)}',
            director: '${element.info.director.replace(/('|")/g, ``)}',
            country: '${element.info.country}',
            text: '${element.info.description.replace(/[\n\r]+/g, "").replace(/('|")/g, ``).substring(0,300) + '...'}',
            status: '${element.serial === '1' ? 'serial' : 'film'}'
          },
          `
          );
          
          return items;
        } catch (error) {
          console.error(error);
        }
      };
      // ----------------------- функция сезонов и эпизодов для фильмов или сериалов -----------------------
      const fetchVideosFilms = async () => {
          try {
          const videosId = await fetchData;
          // дальнейший код отображает страницу с сезонами и сериями для сериала
          videosId.results.map((item) => {
            let videos = [];
            // --------------------------------- проверка на серии(то есть проверка на сериал) ---------------------------------
            let videoSeasonsArrays = item.episodes
              ? item.episodes
              : "no episodes";
            // -----------------------------------------------------------------------------------------------------------------
            app.get("/selectepisodeIdFilms=" + item.kinopoisk_id, (req, res) => {
              let episodes = [];
              // дальнейший код для получения серий и сезонов, тк идет проверка на эпизоды, фильмы будут обрабатывать после else
              if (videoSeasonsArrays !== "no episodes") {
                const seasonsArr = [];
                 // получение из запроса сезонов и эпизодов
                for (let key of Object.keys(item.episodes)) {
                  const episodesArr = [];
                  seasonsArr.push(key);
                  for (let value of Object.values(item.episodes[key])) {
                    episodesArr.push(value);
                  }
                  episodes.push(episodesArr);
                }
                // создание объекта для того чтобы отобразить эпизоды в дальнейшем
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
                     name: '${item.info.orig.replace(/('|")/g, ``)}',
                  },
          `
                  );
                  return videoObject.join("");
                });
                videos.push(items.join(""));
                 // отображение страницы с плеером для определенного сериала с определенными эпизодом и сезоном
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
                          res,
                          `selectepisodeIdFilms=${item.kinopoisk_id}`
                        );
                      }
                    );
                  });
                });
                // создание файла с объектом выше для дальнейшего отображения каждой серии и сезона на странице
                fs.writeFile(
                  "./js/pagesFunctions/films/serialSeasons.js",
                  `(function () {
    "use strict" // страница создана в файле index.js

    window.App.SerialSeasons = [${videos}]
  })();
  `,
                  function (err) {
                    if (err) {
                      return console.log(err);
                    } // проверка на ошибку
                    // страница с сезонами и эпизодами
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
        <script type="text/javascript" src="../js/pagesFunctions/films/videoApp.js"></script>
        <script type="text/javascript" src="../js/pagesFunctions/films/serialSeasons.js"></script>
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
  position: relative;
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
  max-width: 980px;
  width: auto;
  min-height: 300px
  height: auto;
  background: rgba(0, 0, 0, 0.685);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
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
  width: 130px;
  height: 30px;
  margin-right: 10px;
  margin-bottom: 3px;
  margin-top: 3px;
  border-radius: 5px;

}
.episodeBlock h4 {
  font-weight: bold;
  margin-right: 3px;
}
 .waitPopup_block {
    width: 350px;
    height: 100px;
    position: absolute;
    top: 270px;
    left: 410px;
    right: 470px;
    bottom: 480px;
    padding: 20px;
            background: rgba(0, 0, 0, 0.685);
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }
        .waitPopup_wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .waitPopupBackground {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 5;
        }
        .waitPopup_wrap h1 {
          color: white;
          font-family: 'Inter', sans-serif;
        }
</style>

<body>
<div class="waitPopupBackground" id="waitPopup_bg">
        <div class="waitPopup_block" id="waitPopup_block">
            <div class="waitPopup_wrap">
                <h1>Загрузка...</h1>
            </div>
        </div>
</div>
      <div class="selectEpisode selectEpisodeHidden navigation-items scene js-scene-serialSeasons" data-nav_loop="true">
    </div>
</body>
<script type="text/javascript">
    $('html').keyup(function(e){
      if (e.keyCode === 8) {
        /* назад */
        window.location='/films'
      }
      if (e.keyCode === 27) {
        e.preventDefault();
        return false;
      }
      if (e.keyCode === 38) {
        /* вверх */
            $('.focus').get(0).scrollIntoView();
        } else if (e.keyCode === 40) {
          /* вниз */
             $('.focus').get(0).scrollIntoView();
        }
    })  
</script>
</html>`;
                    setTimeout(() => res.send(episodesPage), 500) // Отправка ответа в виде HTML(setTimeout для того чтобы обновляло данные страницы)
                  }
                );
                videos.splice(0, videos.length); // обнуляю массив чтобы не было одних и тех же серий и не было ошибки
              } else {
                // если фильм то сразу создаю страницу с плеером
                getMp4Videos(item, ...[, ,], res, 'films');
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
        // создаю файл с объектами постеров для отображения на странице
        fs.writeFileSync(
          "./js/pagesFunctions/films/videos.js",
          `(function () {
    "use strict" // страница создана в файле index.js

    window.App.videos = [
      ${movieItems}
    ] 
  })();
  `
        );
        // создаю файл для каждого фильма с информацией о фильме
        fs.writeFileSync(
          "./js/pagesFunctions/films/FilmPage.js",
          `(function () {
    "use strict" // страница создана в файле index.js

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
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  var itemHtml = _.template('<div data-content="filmInfo" data-film="{{filmPageId}}" data-id="{{id}}" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;" class="movieitem navigation-item nav-item" data-type="{{type}}"><h4 class="mainMovieTitle">{{title}}</h4></div>');
    
  // создание сцены с постерами
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
        $('.bg').hide();
      $('.bg2').show();
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
      // создаю файл с информацией о фильме
      fs.writeFileSync(
        "./js/scenes/filmInfo.js",
        `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
    // в конце переменной скрипт для перехода на страницу с сезонами и сериями
  var filmPageHtml = _.template('<div id="{{filmPageId}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><div class="poster_blockImg" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;"></div><div class="film-dscrtn"><div><p class="actors">Актеры: {{actors}}</p><p>Страна: {{country}}</p><p>Год:{{created}}</p><p>Режиссер:{{director}}</p></div><h2 id="videotitle">{{title}}</h2></div></div><p class="description">{{text}}</p></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo"><img width="250" height="70" src="./images/UconCinemaLogo.png" alt="logoimg"></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><img width="30" src="./images/arrowBack.svg" alt="arrow" /> Назад</li><li class="menu-item nav-item watchBtn" id="{{id}}"><h4>Смотреть</h4></li></ul></nav></div></div></div><script>var watchBtn = document.getElementById("{{id}}");  if("{{status}}" === "film") {watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeIdFilms={{id}}"; $("#waitPopup_bg").show();$$nav.off()})} else {watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeIdFilms={{id}}"});}</script>');
  
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
    `
      );
      // создаю файл с обработкой сезонов и серий
      fs.writeFileSync(
        "./js/scenes/filmSeasons.js",
        `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
 //  в конце переменной скрипт для перехода на страницу с плеером
  var seasonItems = _.template('<div id="{{id}}" data-content="serialSeasons" class="episodeBlock navigation-item nav-item" data-season="{{season}}" data-episode="{{episode}}"><h4>{{season}}</h4><p>{{episode}}</p></div><script>var selectEpisode = document.getElementById("{{id}}"); selectEpisode.addEventListener("click", function (event) {document.location.href = "/player={{id}}"; $("#waitPopup_bg").show();$$nav.off()});</script>')
  
  // создание сцены с сезонами и сериями
  window.App.scenes.SerialSeasons = {
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
          fetchVideosFilms();
     
     
  } catch (error) {
    console.error(error);
  }
}
// отображение странцы фильмов
 app.get("/films", (req, res) => { 
    getFilms()
    // создание главной страницы
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
        <script type="text/javascript" src="./js/pagesFunctions/films/FilmPage.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/films/videos.js"></script>
        <script type="text/javascript" src="./js/scenes/videosRender.js"></script>
        <script type="text/javascript" src="./js/scenes/filmInfo.js"></script>
        <script type="text/javascript" src="./js/scenes/navigation.js"></script>
  
</head>

<style>

body {
    margin: 0;
    padding: 0;
    height: 100%;
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
    border: 5px solid rgb(207, 178, 14);
    
    padding: 5px;
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


 .focus .mainMovieTitle{
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
    justify-content: space-between;
    max-width: 1200px;
}
.header li {
    list-style-type: none;
    color: #fff;    
    font-size: 23px;
}
.header h2 {
    font-size: 35px;
    border-left: 2px solid white;
}
.header .focus {
    border-bottom: 5px solid rgb(207, 178, 14);
    margin-bottom: -5px;
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
  max-width: 60%;
}

.logo_text h4 {
    margin: 0;
    color: #fff;
}
.film-main {
    padding: 20px;
    display: flex;
    flex-direction: column;
}
.film-info {
    display: flex;
}
.poster_blockImg {
  width: 300px;
  height: 380px;
  margin: 0 30px 30px 0;}
.film-info img {
  object-fit: cover;
  height: 400px;
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
    max-width: 50%;
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
    background: rgba(0, 0, 0, 0.685);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
    width: 30%;
    height: 100vh;
}
.film-nav .focus {
  background-color: #290452;
}
.film-nav_logo {
    
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.back {
  display: flex;
  align-items: center;
    font-size: 22px;
        padding: 30px;
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

.js-scene-video .focus {
    border: 5px solid rgb(207, 178, 14);
    padding: 5px;
}
.bg {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url(./images/stars.png);
            z-index: -1;
        }
        .bg2 {
          display: none;
          position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            background-image: url(./images/stars.png);
            z-index: -1;
}
.log-row {
  color: white;
  font-size: 24px;
}
 .waitPopup_block {
    width: 350px;
    height: 100px;
    position: absolute;
    top: 270px;
    left: 410px;
    right: 470px;
    bottom: 480px;
    padding: 20px;
            background: rgba(0, 0, 0, 0.685);
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }
        .waitPopup_wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .waitPopupBackground {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 5;
        }

</style>
<body>

<div class="bg"></div>
<div class="bg2"></div>
<div class="waitPopupBackground" id="waitPopup_bg">
        <div class="waitPopup_block" id="waitPopup_block">
            <div class="waitPopup_wrap">
                <h1>Загрузка...</h1>
            </div>
        </div>
</div>
<div id="app" class="wrap">
        <div class="header navigation-items">
                <img class="navigation-item nav-item" width="30px" height="30px" src="./images/arrowBack.svg" alt="back" id="img_back">
                <h2>Фильмы</h2>
    </div>
    <div id="movies" class="navbar navigation-items scene scene_video js-scene-video" data-nav_loop="true">
    </div>
    <div class="scene scene_filmInfo film-container js-scene-filmInfo" data-nav_loop="true">
    </div>
    </div>
    <script type='text/javascript'>

      var backBtn = document.getElementById('img_back');
     $('#img_back').click(function() {
      window.location = '/'
    })
     $('html').keyup(function(e){
      if (e.keyCode === 8) {
        /* назад */
        window.location='/'
      }
      if (e.keyCode === 27) {
        e.preventDefault();
        return false;
      }
      if (e.keyCode === 38) {
        /* вверх */
            $('.focus').get(0).scrollIntoView();
        } else if (e.keyCode === 40) {
          /* вниз */
             $('.focus').get(0).scrollIntoView();
        }
    })  

    </script>
</body>
</html>`;
      setTimeout(() => res.send(message), 500) // Отправка ответа в виде HTML(setTimeout для того чтобы обновляло данные страницы) (таймаут нужен для ожидания подгрузки фильмов или сериалов)
 })
// ------------------- функция со всем функционалом serials страницы -----------------------
async function getSerials() {
  try {
      // ----------------------- Делаем запрос для получения списка фильмов или сериалов -----------------------
      const fetchData = fetch(APISERIALS_URL)
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
            title: '${element.info.rus.replace(/('|")/g, ``)}',
            titleEng: '${element.info.orig.replace(/('|")/g, ``)}',
            created: '${element.info.year}',
            filmPageId: 'filmid${element.kinopoisk_id}',
            actors: '${element.info.actors.replace(/('|")/g, ``)}',
            director: '${element.info.director.replace(/('|")/g, ``)}',
            country: '${element.info.country}',
            text: '${element.info.description.replace(/[\n\r]+/g, "").replace(/('|")/g, ``).substring(0,300) + '...'}',
            status: '${element.serial === '1' ? 'serial' : 'film'}'
          },
          `
          );
          
          return items;
        } catch (error) {
          console.error(error);
        }
      };
      // ----------------------- функция сезонов и эпизодов для фильмов или сериалов -----------------------
      const fetchVideosSerials = async () => {
       try {
          const videosId = await fetchData;
          // дальнейший код отображает страницу с сезонами и сериями для сериала
          videosId.results.map((item) => {
            let videos = [];
            // --------------------------------- проверка на серии(то есть проверка на сериал) ---------------------------------
            let videoSeasonsArrays = item.episodes
              ? item.episodes
              : "no episodes";
            // -----------------------------------------------------------------------------------------------------------------
            app.get("/selectepisodeIdSerial=" + item.kinopoisk_id, (req, res) => {
              let episodes = [];
              // дальнейший код для получения серий и сезонов, тк идет проверка на эпизоды, фильмы будут обрабатывать после else
              if (videoSeasonsArrays !== "no episodes") {
                const seasonsArr = [];
                 // получение из запроса сезонов и эпизодов
                for (let key of Object.keys(item.episodes)) {
                  const episodesArr = [];
                  seasonsArr.push(key);
                  for (let value of Object.values(item.episodes[key])) {
                    episodesArr.push(value);
                  }
                  episodes.push(episodesArr);
                }
                // создание объекта для того чтобы отобразить эпизоды в дальнейшем
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
                     name: '${item.info.orig.replace(/('|")/g, ``)}',
                  },
          `
                  );
                  return videoObject.join("");
                });
                videos.push(items.join(""));
                 // отображение страницы с плеером для определенного сериала с определенными эпизодом и сезоном
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
                          res,
                          `selectepisodeIdSerial=${item.kinopoisk_id}`
                        );
                      }
                    );
                  });
                });
                // создание файла с объектом выше для дальнейшего отображения каждой серии и сезона на странице
                fs.writeFile(
                  "./js/pagesFunctions/serials/serialSeasons.js",
                  `(function () {
    "use strict" // страница создана в файле index.js

    window.App.SerialSeasons = [${videos}]
  })();
  `,
                  function (err) {
                    if (err) {
                      return console.log(err);
                    } // проверка на ошибку
                    // страница с сезонами и эпизодами
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
        <script type="text/javascript" src="../js/pagesFunctions/serials/videoApp.js"></script>
        <script type="text/javascript" src="../js/pagesFunctions/serials/serialSeasons.js"></script>
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
  position: relative;
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
  max-width: 980px;
  width: auto;
  min-height: 300px
  height: auto;
  background: rgba(0, 0, 0, 0.685);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
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
  width: 130px;
  height: 30px;
  margin-right: 10px;
  margin-bottom: 3px;
  margin-top: 3px;
  border-radius: 5px;

}
.episodeBlock h4 {
  font-weight: bold;
  margin-right: 3px;
}
 .waitPopup_block {
    width: 350px;
    height: 100px;
    position: absolute;
    top: 270px;
    left: 410px;
    right: 470px;
    bottom: 480px;
    padding: 20px;
            background: rgba(0, 0, 0, 0.685);
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }
        .waitPopup_wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .waitPopupBackground {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 5;
        }
        .waitPopup_wrap h1 {
          color: white;
          font-family: 'Inter', sans-serif;
        }
</style>

<body>
<div class="waitPopupBackground" id="waitPopup_bg">
        <div class="waitPopup_block" id="waitPopup_block">
            <div class="waitPopup_wrap">
                <h1>Загрузка...</h1>
            </div>
        </div>
</div>
      <div class="selectEpisode selectEpisodeHidden navigation-items scene js-scene-serialSeasons" data-nav_loop="true">
    </div>
</body>
<script type="text/javascript">
    $('html').keyup(function(e){
      if (e.keyCode === 8) {
        /* назад */
        window.location='/serials'
      }
      if (e.keyCode === 27) {
        e.preventDefault();
        return false;
      }
      if (e.keyCode === 38) {
        /* вверх */
            $('.focus').get(0).scrollIntoView();
        } else if (e.keyCode === 40) {
          /* вниз */
             $('.focus').get(0).scrollIntoView();
        }
    })  
</script>
</html>`;
                    setTimeout(() => res.send(episodesPage), 500) // Отправка ответа в виде HTML(setTimeout для того чтобы обновляло данные страницы)
                  }
                );
                videos.splice(0, videos.length); // обнуляю массив чтобы не было одних и тех же серий и не было ошибки
              } else {
                // если фильм то сразу создаю страницу с плеером
                getMp4Videos(item, ...[, ,], res, 'serials');
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
        // создаю файл с объектами постеров для отображения на странице
        fs.writeFileSync(
          "./js/pagesFunctions/serials/videos.js",
          `(function () {
    "use strict" // страница создана в файле index.js

    window.App.videos = [
      ${movieItems}
    ] 
  })();
  `
        );
        // создаю файл для каждого фильма с информацией о фильме
        fs.writeFileSync(
          "./js/pagesFunctions/serials/FilmPage.js",
          `(function () {
    "use strict" // страница создана в файле index.js

    window.App.filmInfo = [
      ${movieItems}
    ] 
  })();
  `
        );
      }

      sendFilms();
       // обработка тех объектов постеров для отображения на странице 
      fs.writeFileSync(
        "./js/scenes/videosRender.js",
        `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  var itemHtml = _.template('<div data-content="filmInfo" data-film="{{filmPageId}}" data-id="{{id}}" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;" class="movieitem navigation-item nav-item" data-type="{{type}}"><h4 class="mainMovieTitle">{{title}}</h4></div>');
    
  // создание сцены с постерами
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
        $('.bg').hide();
      $('.bg2').show();
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
      // создаю файл с информацией о фильме
      fs.writeFileSync(
        "./js/scenes/filmInfo.js",
        `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
    // в конце переменной скрипт для перехода на страницу с сезонами и сериями
  var filmPageHtml = _.template('<div id="{{filmPageId}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><div class="poster_blockImg" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;"></div><div class="film-dscrtn"><div><p class="actors">Актеры: {{actors}}</p><p>Страна: {{country}}</p><p>Год:{{created}}</p><p>Режиссер:{{director}}</p></div><h2 id="videotitle">{{title}}</h2></div></div><p class="description">{{text}}</p></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo"><img width="250" height="70" src="./images/UconCinemaLogo.png" alt="logoimg"></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><img width="30" src="./images/arrowBack.svg" alt="arrow" /> Назад</li><li class="menu-item nav-item watchBtn" id="{{id}}"><h4>Смотреть</h4></li></ul></nav></div></div></div><script>var watchBtn = document.getElementById("{{id}}");  if("{{status}}" === "film") {watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeIdSerial={{id}}"; $("#waitPopup_bg").show();$$nav.off()})} else {watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeIdSerial={{id}}"});}</script>');
  
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
    `
      );
      // создаю файл с обработкой сезонов и серий
      fs.writeFileSync(
        "./js/scenes/filmSeasons.js",
        `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
 //  в конце переменной скрипт для перехода на страницу с плеером
  var seasonItems = _.template('<div id="{{id}}" data-content="serialSeasons" class="episodeBlock navigation-item nav-item" data-season="{{season}}" data-episode="{{episode}}"><h4>{{season}}</h4><p>{{episode}}</p></div><script>var selectEpisode = document.getElementById("{{id}}"); selectEpisode.addEventListener("click", function (event) {document.location.href = "/player={{id}}"; $("#waitPopup_bg").show();$$nav.off()});</script>')
  
  // создание сцены с сезонами и сериями
  window.App.scenes.SerialSeasons = {
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
      
      fetchVideosSerials();
     
  } catch (error) {
    console.error(error);
  }
}
// отображение страницы сериалов
 app.get("/serials", (req, res) => { 
    getSerials()
    // создание главной страницы
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
        <script type="text/javascript" src="./js/pagesFunctions/serials/FilmPage.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/serials/videos.js"></script>
        <script type="text/javascript" src="./js/scenes/videosRender.js"></script>
        <script type="text/javascript" src="./js/scenes/filmInfo.js"></script>
        <script type="text/javascript" src="./js/scenes/navigation.js"></script>
  
</head>

<style>

body {
  position:relative;
    margin: 0;
    padding: 0;
    height: 100%;
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
    border: 5px solid rgb(207, 178, 14);
    
    padding: 5px;
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


 .focus .mainMovieTitle{
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
    justify-content: space-between;
    max-width: 1200px;
}
.header li {
    list-style-type: none;
    color: #fff;    
    font-size: 23px;
}
.header h2 {
    font-size: 35px;
    border-left: 2px solid white;
}
.header .focus {
    border-bottom: 5px solid rgb(207, 178, 14);
    margin-bottom: -5px;
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
  max-width: 60%;
}

.logo_text h4 {
    margin: 0;
    color: #fff;
}
.film-main {
    padding: 20px;
    display: flex;
    flex-direction: column;
}
.film-info {
    display: flex;
}
.poster_blockImg {
  width: 300px;
  height: 380px;
  margin: 0 30px 30px 0;}
.film-info img {
  object-fit: cover;
  height: 400px;
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
    max-width: 50%;
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
    background: rgba(0, 0, 0, 0.685);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
    width: 30%;
   height: 100vh;
}
.film-nav .focus {
  background-color: #290452;
}
.film-nav_logo {
    
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.back {
  display: flex;
  align-items: center;
    font-size: 22px;
        padding: 30px;
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

.js-scene-video .focus {
    border: 5px solid rgb(207, 178, 14);
    padding: 5px;
}
.bg {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url(./images/stars.png);
            z-index: -1;
        }
        .bg2 {
          display: none;
          position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            background-image: url(./images/stars.png);
            z-index: -1;
}
.log-row {
  color: white;
  font-size: 24px;
}

 .waitPopup_block {
    width: 350px;
    height: 100px;
    position: absolute;
    top: 270px;
    left: 410px;
    right: 470px;
    bottom: 480px;
    padding: 20px;
            background: rgba(0, 0, 0, 0.685);
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }
        .waitPopup_wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .waitPopupBackground {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 5;
        }


</style>
<body>

<div class="bg"></div>
<div class="bg2"></div>
<div class="waitPopupBackground" id="waitPopup_bg">
        <div class="waitPopup_block" id="waitPopup_block">
            <div class="waitPopup_wrap">
                <h1>Загрузка...</h1>
            </div>
        </div>
</div>
<div id="app" class="wrap">
        <div class="header navigation-items">
                <img class="navigation-item nav-item" width="30px" height="30px" src="./images/arrowBack.svg" alt="back" id="img_back">
                <h2>Сериалы</h2>
    </div>
    <div id="movies" class="navbar navigation-items scene scene_video js-scene-video" data-nav_loop="true">
    </div>
    <div class="scene scene_filmInfo film-container js-scene-filmInfo" data-nav_loop="true">
    </div>
    </div>
    <script type='text/javascript'>

      var backBtn = document.getElementById('img_back');
     $('#img_back').click(function() {
      window.location = '/'
    })
     $('html').keyup(function(e){
      if (e.keyCode === 8) {
        /* назад */
        window.location='/'
      }
      if (e.keyCode === 27) {
        e.preventDefault();
        return false;
      }
      if (e.keyCode === 38) {
        /* вверх */
            $('.focus').get(0).scrollIntoView();
        } else if (e.keyCode === 40) {
          /* вниз */
             $('.focus').get(0).scrollIntoView();
        }
    })  

    </script>
</body>
</html>`;
      setTimeout(() => res.send(message), 500) // Отправка ответа в виде HTML(setTimeout для того чтобы обновляло данные страницы) (таймаут нужен для ожидания подгрузки фильмов или сериалов)
 })
// ------------------- функция со всем функционалом cartoons страницы -----------------------
async function getCartoons() {
  try {
      // ----------------------- Делаем запрос для получения списка фильмов или сериалов -----------------------
      const fetchData = fetch(APICARTOONS_URL)
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
            title: '${element.info.rus.replace(/('|")/g, ``)}',
            titleEng: '${element.info.orig.replace(/('|")/g, ``)}',
            created: '${element.info.year}',
            filmPageId: 'filmid${element.kinopoisk_id}',
            actors: '${element.info.actors.replace(/('|")/g, ``)}',
            director: '${element.info.director.replace(/('|")/g, ``)}',
            country: '${element.info.country}',
            text: '${element.info.description.replace(/[\n\r]+/g, "").replace(/('|")/g, ``).substring(0,300) + '...'}',
            status: '${element.serial === '1' ? 'serial' : 'film'}'
          },
          `
          );
          
          return items;
        } catch (error) {
          console.error(error);
        }
      };
      // ----------------------- функция сезонов и эпизодов для фильмов или сериалов -----------------------
      const fetchVideosCartoons = async () => {
        try {
          const videosId = await fetchData;
          // дальнейший код отображает страницу с сезонами и сериями для сериала
          videosId.results.map((item) => {
            let videos = [];
            // --------------------------------- проверка на серии(то есть проверка на сериал) ---------------------------------
            let videoSeasonsArrays = item.episodes
              ? item.episodes
              : "no episodes";
            // -----------------------------------------------------------------------------------------------------------------
            app.get("/selectepisodeIdCartoons=" + item.kinopoisk_id, (req, res) => {
              let episodes = [];
              // дальнейший код для получения серий и сезонов, тк идет проверка на эпизоды, фильмы будут обрабатывать после else
              if (videoSeasonsArrays !== "no episodes") {
                const seasonsArr = [];
                 // получение из запроса сезонов и эпизодов
                for (let key of Object.keys(item.episodes)) {
                  const episodesArr = [];
                  seasonsArr.push(key);
                  for (let value of Object.values(item.episodes[key])) {
                    episodesArr.push(value);
                  }
                  episodes.push(episodesArr);
                }
                // создание объекта для того чтобы отобразить эпизоды в дальнейшем
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
                     name: '${item.info.orig.replace(/('|")/g, ``)}',
                  },
          `
                  );
                  return videoObject.join("");
                });
                videos.push(items.join(""));
                 // отображение страницы с плеером для определенного сериала с определенными эпизодом и сезоном
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
                          res,
                          `selectepisodeIdCartoons=${item.kinopoisk_id}`
                        );
                      }
                    );
                  });
                });
                // создание файла с объектом выше для дальнейшего отображения каждой серии и сезона на странице
                fs.writeFile(
                  "./js/pagesFunctions/cartoons/serialSeasons.js",
                  `(function () {
    "use strict" // страница создана в файле index.js

    window.App.SerialSeasons = [${videos}]
  })();
  `,
                  function (err) {
                    if (err) {
                      return console.log(err);
                    } // проверка на ошибку
                    // страница с сезонами и эпизодами
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
        <script type="text/javascript" src="../js/pagesFunctions/cartoons/videoApp.js"></script>
        <script type="text/javascript" src="../js/pagesFunctions/cartoons/serialSeasons.js"></script>
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
  position: relative;
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
  max-width: 980px;
  width: auto;
  min-height: 300px
  height: auto;
  background: rgba(0, 0, 0, 0.685);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
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
  width: 130px;
  height: 30px;
  margin-right: 10px;
  margin-bottom: 3px;
  margin-top: 3px;
  border-radius: 5px;

}
.episodeBlock h4 {
  font-weight: bold;
  margin-right: 3px;
}
 .waitPopup_block {
    width: 350px;
    height: 100px;
    position: absolute;
    top: 270px;
    left: 410px;
    right: 470px;
    bottom: 480px;
    padding: 20px;
            background: rgba(0, 0, 0, 0.685);
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }
        .waitPopup_wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .waitPopupBackground {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 5;
        }
         .waitPopup_wrap h1 {
          color: white;
          font-family: 'Inter', sans-serif;
        }
</style>

<body>
<div class="waitPopupBackground" id="waitPopup_bg">
        <div class="waitPopup_block" id="waitPopup_block">
            <div class="waitPopup_wrap">
                <h1>Загрузка...</h1>
            </div>
        </div>
</div>
      <div class="selectEpisode selectEpisodeHidden navigation-items scene js-scene-serialSeasons" data-nav_loop="true">
    </div>
</body>
<script type="text/javascript">
    $('html').keyup(function(e){
      if (e.keyCode === 8) {
        /* назад */
        window.location='/cartoons'
      }
      if (e.keyCode === 27) {
        e.preventDefault();
        return false;
      }
      if (e.keyCode === 38) {
        /* вверх */
            $('.focus').get(0).scrollIntoView();
        } else if (e.keyCode === 40) {
          /* вниз */
             $('.focus').get(0).scrollIntoView();
        }
    })  
</script>
</html>`;
                    setTimeout(() => res.send(episodesPage), 500) // Отправка ответа в виде HTML(setTimeout для того чтобы обновляло данные страницы)
                  }
                );
                videos.splice(0, videos.length); // обнуляю массив чтобы не было одних и тех же серий и не было ошибки
              } else {
                // если фильм то сразу создаю страницу с плеером
                getMp4Videos(item, ...[, ,], res, 'cartoons');
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
        // создаю файл с объектами постеров для отображения на странице
        fs.writeFileSync(
          "./js/pagesFunctions/cartoons/videos.js",
          `(function () {
    "use strict" // страница создана в файле index.js

    window.App.videos = [
      ${movieItems}
    ] 
  })();
  `
        );
         // создаю файл для каждого фильма с информацией о фильме
        fs.writeFileSync(
          "./js/pagesFunctions/cartoons/FilmPage.js",
          `(function () {
    "use strict" // страница создана в файле index.js

    window.App.filmInfo = [
      ${movieItems}
    ] 
  })();
  `
        );
      }

      sendFilms();
      // обработка тех объектов постеров для отображения на странице 
      fs.writeFileSync(
        "./js/scenes/videosRender.js",
        `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  var itemHtml = _.template('<div data-content="filmInfo" data-film="{{filmPageId}}" data-id="{{id}}" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;" class="movieitem navigation-item nav-item" data-type="{{type}}"><h4 class="mainMovieTitle">{{title}}</h4></div>');
    
  // создание сцены с постерами
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
        $('.bg').hide();
        $('.bg2').show();
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
      // создаю файл с информацией о фильме
      fs.writeFileSync(
        "./js/scenes/filmInfo.js",
        `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
    // в конце переменной скрипт для перехода на страницу с сезонами и сериями
  var filmPageHtml = _.template('<div id="{{filmPageId}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><div class="poster_blockImg" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;"></div><div class="film-dscrtn"><div><p class="actors">Актеры: {{actors}}</p><p>Страна: {{country}}</p><p>Год:{{created}}</p><p>Режиссер:{{director}}</p></div><h2 id="videotitle">{{title}}</h2></div></div><p class="description">{{text}}</p></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo"><img width="250" height="70" src="./images/UconCinemaLogo.png" alt="logoimg"></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><img width="30" src="./images/arrowBack.svg" alt="arrow" /> Назад</li><li class="menu-item nav-item watchBtn" id="{{id}}"><h4>Смотреть</h4></li></ul></nav></div></div></div><script>var watchBtn = document.getElementById("{{id}}");  if("{{status}}" === "film") {watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeIdCartoons={{id}}"; $("#waitPopup_bg").show();$$nav.off()})} else {watchBtn.addEventListener("click", function (event) {document.location.href = "/selectepisodeIdCartoons={{id}}"});}</script>');
  
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
    `
      );
      // создаю файл с обработкой сезонов и серий
      fs.writeFileSync(
        "./js/scenes/filmSeasons.js",
        `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
 //  в конце переменной скрипт для перехода на страницу с плеером
  var seasonItems = _.template('<div id="{{id}}" data-content="serialSeasons" class="episodeBlock navigation-item nav-item" data-season="{{season}}" data-episode="{{episode}}"><h4>{{season}}</h4><p>{{episode}}</p></div><script>var selectEpisode = document.getElementById("{{id}}"); selectEpisode.addEventListener("click", function (event) {document.location.href = "/player={{id}}"; $("#waitPopup_bg").show();$$nav.off()});</script>')
  
  // создание сцены с сезонами и сериями
  window.App.scenes.SerialSeasons = {
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
      
      fetchVideosCartoons();
     
     
  } catch (error) {
    console.error(error);
  }
}
// отображение страницы мультфильмов
 app.get("/cartoons", (req, res) => { 
    getCartoons()
    // создание главной страницы
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
        <script type="text/javascript" src="./js/pagesFunctions/cartoons/FilmPage.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/cartoons/videos.js"></script>
        <script type="text/javascript" src="./js/scenes/videosRender.js"></script>
        <script type="text/javascript" src="./js/scenes/filmInfo.js"></script>
        <script type="text/javascript" src="./js/scenes/navigation.js"></script>
  
</head>

<style>

body {
  position:relative;
    margin: 0;
    padding: 0;
    height: 100%;
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
    border: 5px solid rgb(207, 178, 14);
    
    padding: 5px;
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


 .focus .mainMovieTitle{
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
    justify-content: space-between;
    max-width: 1200px;
}
.header li {
    list-style-type: none;
    color: #fff;    
    font-size: 23px;
}
.header h2 {
    font-size: 35px;
    border-left: 2px solid white;
}
.header .focus {
    border-bottom: 5px solid rgb(207, 178, 14);
    margin-bottom: -5px;
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
  max-width: 60%;
}

.logo_text h4 {
    margin: 0;
    color: #fff;
}
.film-main {
    padding: 20px;
    display: flex;
    flex-direction: column;
}
.film-info {
    display: flex;
}
.poster_blockImg {
  width: 300px;
  height: 380px;
  margin: 0 30px 30px 0;}
.film-info img {
    object-fit: cover;
    height: 400px;
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
    max-width: 50%;
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
    background: rgba(0, 0, 0, 0.685);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
    width: 30%;
    height: 100vh;
}
.film-nav .focus {
  background-color: #290452;
}
.film-nav_logo {
    
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.back {
  display: flex;
  align-items: center;
    font-size: 22px;
        padding: 30px;
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

.js-scene-video .focus {
    border: 5px solid rgb(207, 178, 14);
    padding: 5px;
}
.bg {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url(./images/stars.png);
            z-index: -1;
        }
        .bg2 {
          display: none;
          position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            background-image: url(./images/stars.png);
            z-index: -1;
}
.log-row {
  color: white;
  font-size: 24px;
}

 .waitPopup_block {
    width: 350px;
    height: 100px;
    position: absolute;
    top: 270px;
    left: 410px;
    right: 470px;
    bottom: 480px;
    padding: 20px;
            background: rgba(0, 0, 0, 0.685);
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }
        .waitPopup_wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .waitPopupBackground {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 5;
        }


</style>
<body>

<div class="bg"></div>
<div class="bg2"></div>
<div class="waitPopupBackground" id="waitPopup_bg">
        <div class="waitPopup_block" id="waitPopup_block">
            <div class="waitPopup_wrap">
                <h1>Загрузка...</h1>
            </div>
        </div>
</div>
<div id="app" class="wrap">
        <div class="header navigation-items">
                <img class="navigation-item nav-item" width="30px" height="30px" src="./images/arrowBack.svg" alt="back" id="img_back">
                <h2>Мультфильмы</h2>
    </div>
    <div id="movies" class="navbar navigation-items scene scene_video js-scene-video" data-nav_loop="true">
    </div>
    <div class="scene scene_filmInfo film-container js-scene-filmInfo" data-nav_loop="true">
    </div>
    </div>
    <script type='text/javascript'>

      var backBtn = document.getElementById('img_back');
     $('#img_back').click(function() {
      window.location = '/'
    })
    $('html').keyup(function(e){
      if (e.keyCode === 8) {
        /* назад */
        window.location='/'
      }
      if (e.keyCode === 27) {
        e.preventDefault();
        return false;
      }
      if (e.keyCode === 38) {
        /* вверх */
            $('.focus').get(0).scrollIntoView();
        } else if (e.keyCode === 40) {
          /* вниз */
             $('.focus').get(0).scrollIntoView();
        }
    })  

    </script>
</body>
</html>`;
      setTimeout(() => res.send(message), 500) // Отправка ответа в виде HTML(setTimeout для того чтобы обновляло данные страницы) (таймаут нужен для ожидания подгрузки фильмов или сериалов)
 })


 async function getCompilations() {
  try {
      // ----------------------- Делаем запрос для получения списка фильмов или сериалов -----------------------
      const fetchData = fetch(APICOMPILATIONS_URL)
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
            title: '${element.info.rus.replace(/('|")/g, ``)}',
            titleEng: '${element.info.orig.replace(/('|")/g, ``)}',
            created: '${element.info.year}',
            filmPageId: 'filmid${element.kinopoisk_id}',
            actors: '${element.info.actors.replace(/('|")/g, ``)}',
            director: '${element.info.director.replace(/('|")/g, ``)}',
            country: '${element.info.country}',
            text: '${element.info.description.replace(/[\n\r]+/g, "").replace(/('|")/g, ``).substring(0,300) + '...'}',
            status: '${element.serial === '1' ? 'serial' : 'film'}'
          },
          `
          );
          
          return items;
        } catch (error) {
          console.error(error);
        }
      };
      // ----------------------- функция сезонов и эпизодов для фильмов или сериалов -----------------------
      const fetchVideosCompilations = async () => {
        try {
          const videosId = await fetchData;
          // дальнейший код отображает страницу с сезонами и сериями для сериала
          videosId.results.map((item) => {
            let videos = [];
            
            // --------------------------------- проверка на серии(то есть проверка на сериал) ---------------------------------
            let videoSeasonsArrays = item.episodes
              ? item.episodes
              : "no episodes";
            // -----------------------------------------------------------------------------------------------------------------
            app.get("/selectepisodeIdCompilations=" + item.kinopoisk_id, (req, res) => {
              let episodes = [];
              // дальнейший код для получения серий и сезонов, тк идет проверка на эпизоды, фильмы будут обрабатывать после else
              if (videoSeasonsArrays !== "no episodes") {
                const seasonsArr = [];
                 // получение из запроса сезонов и эпизодов
                for (let key of Object.keys(item.episodes)) {
                  const episodesArr = [];
                  seasonsArr.push(key);
                  for (let value of Object.values(item.episodes[key])) {
                    episodesArr.push(value);
                  }
                  episodes.push(episodesArr);
                }
                // создание объекта для того чтобы отобразить эпизоды в дальнейшем
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
                     name: '${item.info.orig.replace(/('|")/g, ``)}',
                  },
          `
                  );
                  return videoObject.join("");
                });
                videos.push(items.join(""));
                 // отображение страницы с плеером для определенного сериала с определенными эпизодом и сезоном
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
                          res,
                          `selectepisodeIdCompilations=${item.kinopoisk_id}`
                        );
                      }
                    );
                  });
                });
                // создание файла с объектом выше для дальнейшего отображения каждой серии и сезона на странице
                fs.writeFile(
                  "./js/pagesFunctions/compilations/serialSeasons.js",
                  `(function () {
    "use strict" // страница создана в файле index.js

    window.App.SerialSeasons = [${videos}]
  })();
  `,
                  function (err) {
                    if (err) {
                      return console.log(err);
                    } // проверка на ошибку
                    // страница с сезонами и эпизодами
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
        <script type="text/javascript" src="../js/pagesFunctions/compilations/videoApp.js"></script>
        <script type="text/javascript" src="../js/pagesFunctions/compilations/serialSeasons.js"></script>
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
  position: relative;
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
  max-width: 980px;
  width: auto;
  min-height: 300px
  height: auto;
  background: rgba(0, 0, 0, 0.685);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
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
  width: 130px;
  height: 30px;
  margin-right: 10px;
  margin-bottom: 3px;
  margin-top: 3px;
  border-radius: 5px;

}
.episodeBlock h4 {
  font-weight: bold;
  margin-right: 3px;
}
 .waitPopup_block {
    width: 350px;
    height: 100px;
    position: absolute;
    top: 270px;
    left: 410px;
    right: 470px;
    bottom: 480px;
    padding: 20px;
            background: rgba(0, 0, 0, 0.685);
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }
        .waitPopup_wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .waitPopupBackground {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 5;
        }
         .waitPopup_wrap h1 {
          color: white;
          font-family: 'Inter', sans-serif;
        }
</style>

<body>
<div class="waitPopupBackground" id="waitPopup_bg">
        <div class="waitPopup_block" id="waitPopup_block">
            <div class="waitPopup_wrap">
                <h1>Загрузка...</h1>
            </div>
        </div>
</div>
      <div class="selectEpisode selectEpisodeHidden navigation-items scene js-scene-serialSeasons" data-nav_loop="true">
    </div>
</body>
<script type="text/javascript">
    $('html').keyup(function(e){
      if (e.keyCode === 8) {
        /* назад */
        window.location='/compilations'
      }
      if (e.keyCode === 27) {
        e.preventDefault();
        return false;
      }
      if (e.keyCode === 38) {
        /* вверх */
            $('.focus').get(0).scrollIntoView();
        } else if (e.keyCode === 40) {
          /* вниз */
             $('.focus').get(0).scrollIntoView();
        }
    })  
</script>
</html>`;
                    setTimeout(() => res.send(episodesPage), 500) // Отправка ответа в виде HTML(setTimeout для того чтобы обновляло данные страницы)
                  }
                );
                videos.splice(0, videos.length); // обнуляю массив чтобы не было одних и тех же серий и не было ошибки
              } else {
                // если фильм то сразу создаю страницу с плеером
                getMp4Videos(item, ...[, ,], res, 'compilations');
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
        // создаю файл с объектами постеров для отображения на странице
        fs.writeFileSync(
          "./js/pagesFunctions/compilations/videos.js",
          `(function () {
    "use strict" // страница создана в файле index.js

    window.App.videos = [
      ${movieItems}
    ] 
  })();
  `
        );
         // создаю файл для каждого фильма с информацией о фильме
        fs.writeFileSync(
          "./js/pagesFunctions/compilations/FilmPage.js",
          `(function () {
    "use strict" // страница создана в файле index.js

    window.App.filmInfo = [
      ${movieItems}
    ] 
  })();
  `
        );
      }

      sendFilms();
      // обработка тех объектов постеров для отображения на странице 
      fs.writeFileSync(
        "./js/scenes/videosRender.js",
        `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  var itemHtml = _.template('<div data-content="filmInfo" data-film="{{filmPageId}}" data-id="{{id}}" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;" class="movieitem navigation-item nav-item" data-type="{{type}}"><h4 class="mainMovieTitle">{{title}}</h4></div>');
    
  // создание сцены с постерами
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
        $('.bg').hide();
        $('.bg2').show();
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
      // создаю файл с информацией о фильме
      fs.writeFileSync(
        "./js/scenes/filmInfo.js",
        `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
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
    `
      );
      // создаю файл с обработкой сезонов и серий
      fs.writeFileSync(
        "./js/scenes/filmSeasons.js",
        `(function () {
  var _inited; // страница создана в файле index.js
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
 //  в конце переменной скрипт для перехода на страницу с плеером
  var seasonItems = _.template('<div id="{{id}}" data-content="serialSeasons" class="episodeBlock navigation-item nav-item" data-season="{{season}}" data-episode="{{episode}}"><h4>{{season}}</h4><p>{{episode}}</p></div><script>var selectEpisode = document.getElementById("{{id}}"); selectEpisode.addEventListener("click", function (event) {document.location.href = "/player={{id}}"; $("#waitPopup_bg").show(); $$nav.off()});</script>')
  
  // создание сцены с сезонами и сериями
  window.App.scenes.SerialSeasons = {
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
      fetchVideosCompilations();
     
     
  } catch (error) {
    console.error(error);
  }
}
// отображение страницы подборок
 app.get("/compilations", (req, res) => { 
    getCompilations()
    // создание главной страницы
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
        <script type="text/javascript" src="./js/pagesFunctions/compilations/FilmPage.js"></script>
        <script type="text/javascript" src="./js/pagesFunctions/compilations/videos.js"></script>
        <script type="text/javascript" src="./js/scenes/videosRender.js"></script>
        <script type="text/javascript" src="./js/scenes/filmInfo.js"></script>
        <script type="text/javascript" src="./js/scenes/navigation.js"></script>
  
</head>

<style>

body {
  position:relative;
    margin: 0;
    padding: 0;
    height: 100%;
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
    border: 5px solid rgb(207, 178, 14);
    padding: 5px;
    
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


 .focus .mainMovieTitle{
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
    justify-content: space-between;
    max-width: 1200px;
}
.header li {
    list-style-type: none;
    color: #fff;    
    font-size: 23px;
}
.header h2 {
    font-size: 35px;
    border-left: 2px solid white;
}
.header .focus {
    border-bottom: 5px solid rgb(207, 178, 14);
    margin-bottom: -5px;
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
  max-width: 60%;
}

.logo_text h4 {
    margin: 0;
    color: #fff;
}
.film-main {
    padding: 20px;
    display: flex;
    flex-direction: column;
}
.film-info {
    display: flex;
}
.poster_blockImg {
  width: 300px;
  height: 380px;
margin: 0 30px 30px 0;}
.film-info img {
    object-fit: cover;
    height: 400px;
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
    max-width: 50%;
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
    background: rgba(0, 0, 0, 0.685);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
    width: 30%;
   height: 100vh;
}
.film-nav .focus {
  background-color: #290452;
}

.film-nav_logo {
    
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.back {
  display: flex;
  align-items: center;
    font-size: 22px;
        padding: 30px;
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

.js-scene-video .focus {
    border: 5px solid rgb(207, 178, 14);
    padding: 5px;
}
.bg {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url(./images/stars.png);
            z-index: -1;
        }
        .bg2 {
          display: none;
          position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            background-image: url(./images/stars.png);
            z-index: -1;
}
.log-row {
  color: white;
  font-size: 24px;
}
 .waitPopup_block {
    width: 350px;
    height: 100px;
    position: absolute;
    top: 270px;
    left: 410px;
    right: 470px;
    bottom: 480px;
    padding: 20px;
            background: rgba(0, 0, 0, 0.685);
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
        }
        .waitPopup_wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .waitPopupBackground {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 5;
        }



</style>
<body>

<div class="bg"></div>
<div class="bg2"></div>
<div class="waitPopupBackground" id="waitPopup_bg">
        <div class="waitPopup_block" id="waitPopup_block">
            <div class="waitPopup_wrap">
                <h1>Загрузка...</h1>
            </div>
        </div>
</div>
<div id="app" class="wrap">
        <div class="header navigation-items">
                <img class="navigation-item nav-item" width="30px" height="30px" src="./images/arrowBack.svg" alt="back" id="img_back">
                <h2>Подборки</h2>
    </div>
    <div id="movies" class="navbar navigation-items scene scene_video js-scene-video" data-nav_loop="true">
    </div>
    <div class="scene scene_filmInfo film-container js-scene-filmInfo" data-nav_loop="true">
    </div>
    </div>
    <script type='text/javascript'>

      var backBtn = document.getElementById('img_back');
   $('#img_back').click(function() {
      window.location = '/'
    })
     $('html').keyup(function(e){
      if (e.keyCode === 8) {
        /* назад */
        window.location='/'
      }
      if (e.keyCode === 27) {
        e.preventDefault();
        return false;
      }
      if (e.keyCode === 38) {
        /* вверх */
            $('.focus').get(0).scrollIntoView();
        } else if (e.keyCode === 40) {
          /* вниз */
             $('.focus').get(0).scrollIntoView();
        }
    })  
    

    </script>
</body>
</html>`;
      setTimeout(() => res.send(message), 500) // Отправка ответа в виде HTML(setTimeout для того чтобы обновляло данные страницы) (таймаут нужен для ожидания подгрузки фильмов или сериалов)
 })



const port = process.env.PORT || 3000;
app.listen(port)
console.log(`Server is listening on port ${port}`);