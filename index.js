const express = require("express");
const fetch = require("node-fetch");
var app = express();
const path = require("path");
var _ = require("lodash");
const fs = require("fs");

app.use(express.static(__dirname));

const APIANIMEVIDEO_TOKEN = "a88d97e1788ae00830c4665ab33b7f87";

const APIANIME_TOKEN = "a88d97e1788ae00830c4665ab33b7f87";
let APIANIME_URL = `https://bazon.cc/api/json?token=${APIANIME_TOKEN}&type=all&page=1&cat=аниме`;

const fetchDataAnime = fetch(APIANIME_URL).then((response) => {
  return response.json();
});

const showAnime = async () => {
  try {
    const commits = await fetchDataAnime;
    let items = commits.results.map(
      (element) =>
        `{
            id: '${element.kinopoisk_id}',
            url: 'https://rr2---sn-5hne6nzd.googlevideo.com/videoplayback?expire=1681242978&ei=Amc1ZJfOM_-vxN8PpcuDqAE&ip=216.131.88.117&id=o-AO3t0G1jpMG1_42TRr2nQw5hmIBdtGLgnjRN4_MRW1Wn&itag=22&source=youtube&requiressl=yes&mh=aB&mm=31%2C26&mn=sn-5hne6nzd%2Csn-4g5ednld&ms=au%2Conr&mv=m&mvi=2&pl=23&initcwndbps=1025000&spc=99c5Cf2M6edL4CK_oQZBkROtGM-yDlYAZtY6wfW4iQ&vprv=1&mime=video%2Fmp4&ns=Ysa-2eCStXlBEExKClwli1EM&cnr=14&ratebypass=yes&dur=155.829&lmt=1655331954967271&mt=1681220954&fvip=3&fexp=24007246&c=WEB&txp=4532434&n=cesb5bSUSkdc9g&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIgF_EvYJyxsUvnRmGKgBO-_dJuOh2_mfD8s5-BUiQ3-jQCIQDobUmPYq_bnyecw1btkBJe6Qgv5NFdCJpNMTbW8CmnKA%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhALm-q3C2Hed9_Gg-7M7edN_wWzthpcAMYi16A_N9aMaXAiAQSAdq341NXpS8itDtWWlNSqV5STTwARSZoPkhC6NKuA%3D%3D&title=JavaScript%20in%20100%20Seconds',
            type: 'vod',
            imgurl: '${element.info.poster}',
            title: '${element.info.rus}',
            created: '${element.info.year}',
            filmPageId: 'filmid${element.kinopoisk_id}',
            actors: '${element.info.actors}',
            director: '${element.info.director}',
            description: \`${element.info.description}\`,
            country: '${element.info.country}',
          },
          `
    );
    return items;
  } catch (error) {
    console.error(error);
  }
};

async function sendAnime() {
  const movies = await showAnime();
  const movieItems = movies.join("");
  fs.writeFileSync(
    "./js/anime/animeVideos.js",
    `(function () {
    "use strict"

    window.App.videos = [
      ${movieItems}
    ] 
  })();
  `
  );
  fs.writeFileSync(
    "./js/anime/animeFilmPage.js",
    `(function () {
    "use strict"

    window.App.filmInfo = [
      ${movieItems}
    ] 
  })();
  `
  );
}
sendAnime();

async function getAnime() {
  try {
    // используем movies в шаблонной строке:
    fs.writeFileSync(
      "./js/scenes/animeVideosRender.js",
      `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  var itemHtml = _.template('<div data-content="filmInfo" data-film="{{filmPageId}}" data-id="{{id}}" style="background: url({{imgurl}}); background-repeat:no-repeat;  background-size:cover;" class="movieitem navigation-item nav-item video-item" data-url="{{url}}" data-type="{{type}}"><h4>{{title}}</h4></div>');
  
    
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

    `
    );
    fs.writeFileSync(
      "./js/scenes/animeFilmInfo.js",
      `(function () {
  var _inited;
    _.templateSettings.interpolate = /\\{\\{([\\s\\S]+?)\\}\\}/g;
  var filmPageHtml = _.template('<div id="{{filmPageId}}"  data-id="{{id}}" class="filmInfoPage"><div class="film-info_inner"><div class="film-main"><div class="film-info"><img src="{{imgurl}}" alt="posterimg"><div class="film-dscrtn"><div><p class="actors">Актеры: {{actors}}</p><p>Страна: {{country}}</p><p>Год:{{created}}</p><p>Режиссер:{{director}}</p></div><h2>{{title}}</h2></div></div><p class="film-description">{{description}}</p></div><nav class="film-nav"><div class="film-nav_logo"><div class="UconCinema_logo"><img src="" alt="logoimg"><div class="logo_text"><h4>Ucon Cinema</h4><p>Домашний кинотеатр</p></div></div></div><ul class="film-voiceover menu-items" data-nav_type="vbox" data-nav_loop="true"><li data-content="video" class="back menu-item nav-item"><img width="30" src="./images/arrowBack.svg" alt="arrow" /> Назад</li><li data-url="{{url}}" class="voiceover menu-item nav-item video-item">Озвучка 1</div></ul></nav></div></div>');
   var stb = gSTB;
  window.App.scenes.filmInfo = {
    init: function () {
      this.$el = $(".js-scene-filmInfo");

      this.renderItems(App.filmInfo);
      _inited = true;
      $(".back").on("click", function (event) {
         var scene = event.currentTarget.getAttribute("data-content");
         $(".header").show();
         window.App.showContent(scene);
       });
       $(".voiceover").on("click", function (e) {
         var url = e.currentTarget.getAttribute("data-url");
    stb.InitPlayer();
    stb.SetPIG(1, 1, 0, 0);
    stb.EnableServiceButton(true);
    stb.EnableVKButton(false);
    stb.SetTopWin(0);
    stb.Play(url);
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
        <link rel="stylesheet" href="./style.css">

        <script type="text/javascript" src="./src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="./src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="./src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="./js/lib/smartbox.js"></script>
        <script type="text/javascript" src="./js/app.js"></script>
        <script type="text/javascript" src="./js/anime/animeVideos.js"></script>
        <script type="text/javascript" src="./js/scenes/animeVideosRender.js"></script>
        <script type="text/javascript" src="./js/anime/animeFilmPage.js"></script>
        <script type="text/javascript" src="./js/scenes/animeFilmInfo.js"></script>
        <script type="text/javascript" src="./js/scenes/navigation.js"></script>
    <script type="text/javascript" src="./js/scenes/input.js"></script>

    
  
</head>

<style>
.film-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
     background: url('./images/bg.jpg') no-repeat center center fixed;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
    background-repeat:repeat;
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
    gap: 10px;
}

p {
    margin: 0;
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
    gap: 20px;
}

.film-info img {
    width: 25%;
    margin-bottom: 10px;
}


.film-dscrtn {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding-bottom: 40px;
}

.actors {
    margin-bottom: 15px;
}
.film-description {
  max-width: 80%;
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
    gap: 10px;
    font-size: 22px;
        padding: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.151);
        margin-left: -40px;
}

.voiceover {
    font-size: 22px;
    padding: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.151);
    margin-left: -40px;
    padding-left: 40px;
}


body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    height: 100vh;
    overflow-x: hidden;
}
.bg {
    width: 100vw;
    height: 100%;
    position:absolute;
    z-index:-5;
    top:0;
    left:-20.1vw;
    
    background: url('./images/bg.jpg') no-repeat center center fixed;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
    background-repeat:repeat;
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
    position: relative;
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
    gap: 20px;
    margin-top: 30px;
    width: 100%;
}



.movieitem {
    width: 180px;
    height: 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    cursor: pointer;
}
.movieitem h4 {
  display: none;
}
.movieitem p {
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
.movieitem:hover p{
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
    margin-bottom: -1px;
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

.focus p {
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
 }

 .focus h4{
  display: block;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 0 2px #000, 
0 3px 3px #000, 
-1px 0 1px #000, 
0 -1px 1px #000;;
 }

.focus {
    border-bottom: 5px solid yellow;
    margin-bottom: -5px;
    border-radius: 5px;
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
    gap: 10px;
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
</style>
<body>
<div id="app" class="wrap">
    <div class='bg'></div>
        <div class="header navigation-items">
                <a class="navigation-item nav-item" id='Films' href="/films">
                    <li>Фильмы</li>
                </a>
                <a class="navigation-item nav-item" id='Serials' href="/serials">
                    <li>Сериалы</li>
                </a>
                <a class="navigation-item nav-item" id='Cartoons' href="/cartoons">
                    <li>Мультфильмы</li>
                </a>
                <h2>Аниме</h2>
                <a class="navigation-item nav-item" id='Premieres' href="/premieres">
                    <li>Премьеры</li>
                </a>
                <a class="navigation-item nav-item" id='Compilations' href="/compilations">
                    <li>Подборки</li>
                </a>
        
    </div>
    <div id="movies" class="navbar navigation-items scene scene_video js-scene-video" data-nav_loop="true">
    </div>
    </div>
    <div class="scene scene_filmInfo film-container js-scene-filmInfo"></div>
    <script type='text/javascript'>
    var cartoons = document.getElementById('Cartoons')
    var serials = document.getElementById('Serials')
    var films = document.getElementById('Films')
    var premieres = document.getElementById('Premieres')
    var compilations = document.getElementById('Compilations')


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

    app.get("/anime", (req, res) => {
      res.send(message); // Отправка ответа в виде HTML
    });
  } catch (error) {
    console.error(error);
  }
}

getAnime();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Server is listening on port ${port}`);

// rm -rf xyz - удалить репозиторий с амазон
