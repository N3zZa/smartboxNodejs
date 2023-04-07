const express = require("express");
const fetch = require("node-fetch");
var app = express();
const path = require("path");
var _ = require("lodash");
const fs = require("fs");

app.use(express.static(__dirname));

const APIANIMEVIDEO_TOKEN = "a88d97e1788ae00830c4665ab33b7f87";

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
        `{
            id: '${element.kinopoisk_id}',
            url: 'https://rr4---sn-5uh5o-f5f6.googlevideo.com/videoplayback?expire=1680884401&ei=Ue4vZPykF5royAX34LuwBw&ip=176.67.86.152&id=o-AF8SOeWyFcEJb588UeNeQAE2EKbaTWTHPsQfH-ATNfEe&itag=22&source=youtube&requiressl=yes&mh=aB&mm=31%2C29&mn=sn-5uh5o-f5f6%2Csn-f5f7kn7z&ms=au%2Crdu&mv=m&mvi=4&pcm2cms=yes&pl=24&initcwndbps=808750&spc=99c5CTj7237n85SoMxBfzaugtIaWds-jkJd_xuH4-g&vprv=1&mime=video%2Fmp4&ns=y-iLKRUsxEs3hf0y9EMw_fQM&cnr=14&ratebypass=yes&dur=155.829&lmt=1655331954967271&mt=1680862630&fvip=4&fexp=24007246&c=WEB&txp=4532434&n=9IQjXUUbLE5WKg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRgIhANDB6MW1-x0aNTPQV9CyP3Dec3iOikBrq6-_l1E3J3hcAiEA3l95OB9Ja5DBYshwDDbLnTHCEPCkAoqv-KGO4nLU0q0%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpcm2cms%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIgRkviNXH4jP_PQmhCKV2Bc6MQSo70n2DfYQJ_38UMnc0CIQCMq5GqLAxvYWGxlZenQ4W2bbbslNPXjtxtvkfPMUxgLg%3D%3D&title=JavaScript%20in%20100%20Seconds',
            type: 'vod',
            imgurl: 'https://kinopoiskapiunofficial.tech/images/posters/kp/${element.kinopoisk_id}.jpg',
            title: '${element.ru_title}',
            created: '${element.created}'
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
  const movieItems = movies[0]
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

  var itemHtml = _.template('<div data-id="{{id}}" class="movieitem navigation-item nav-item video-item" data-url="{{url}}" data-type="{{type}}"><img id="imglogo" src="{{imgurl}}"/><h4>{{title}}</h4><p>{{created}}</p></div>');

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

    // "https://a54t.bazonserver.site/manifest/22655/2160.mp4/index.m3u8?hash=bwIIa3zdRMQAyWs9noh5PQ&expires=1680659139&id=22655&name=2160.mp4"
    // handler for click event
    onItemClick: function (e) {
      var url = e.currentTarget.getAttribute("data-url");
      Player.play({
        url: url,
        type: e.currentTarget.getAttribute("data-type"),
      });
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
        <script type="text/javascript" src="./js/anime/animeVideos.js"></script>
        <script type="text/javascript" src="./js/scenes/animeVideosRender.js"></script>
        <script type="text/javascript" src="./js/scenes/navigation.js"></script>
    <script type="text/javascript" src="./js/scenes/input.js"></script>

    
  
</head>

<style>

body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background: #41334c;
    height: 100vh;
}
p,
h1, h2,
h3, h4, li {
    color: #fff;
    font-family: 'Inter', sans-serif;
}
.app {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}

a {
    text-decoration: none;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.header h2:before {
    content: '';
    border: 1px solid #fff;
    margin-right: 4px;
}

.categories {
    padding: 0 30px;
    background: #2b2a32;
    width: 30%;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
    position: relative;
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
    background: #2b2a32;
    width: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    cursor: pointer;
}

.movieitem:hover {
    outline: 5px solid yellow;
    outline-offset: -4px;
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

.focus {
   outline: 5px solid yellow;
   background: none;
}
video {
    right:0;
    width:100%;
}

.header img {
    cursor: pointer;
}


.category-list {
    position: absolute;
    background: #2b2a32;
    padding-left: 0;
    left: 0;
    z-index: 5;
    top: 50px;
    padding: 10px 15px;
    width: 91%;
    flex-direction: column;
    gap: 10px;
    border-radius: 15px;
    display: none;
}


.category-list li {
    list-style-type: none;
    color: #fff;    
    font-size: 20px;
    text-align: left;
}.focus {
    background: #553c64;
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
    <div id="app" class="app">
        <div class="header">
        <img class='navigation-item nav-item' id="arrowback" onclick="window.history.go(-1)" width="50" src="../../images/arrowBack.svg"
            alt="arrowback">
            <img id="imglogo" class='navigation-item nav-item' onclick="window.location.href = '/'" width="75" src="../../images/UconCinemaLogo.png" alt="logoimg">
        <div id="categories" class="categories navigation-item nav-item">
            <h1>Категории</h1>
            <ul id="categorylist" class="category-list">
                <a id='Films' href="/films">
                    <li>Фильмы</li>
                </a>
                <a id='Serials' href="/serials">
                    <li>Сериалы</li>
                </a>
                <a id='Cartoons' href="/cartoons">
                    <li>Мультфильмы</li>
                </a>
                <a id='Premieres' href="/premieres">
                    <li>Премьеры</li>
                </a>
                <a id='Compilations' href="/compilations">
                    <li>Подборки</li>
                </a>
            </ul>
        </div>
        <h2>Аниме</h2>
    </div>
    <div id="movies" class="navbar navigation-items scene scene_video js-scene-video" data-nav_loop="true">
    </div>
    </div>
    <script type='text/javascript'>
    var arrowback = document.getElementById('arrowback')
    var imglogo = document.getElementById('imglogo')
    var categories = document.getElementById('categories')
    var categorylist = document.getElementById('categorylist')


    var cartoons = document.getElementById('Cartoons')
    var serials = document.getElementById('Serials')
    var films = document.getElementById('Films')
    var premieres = document.getElementById('Premieres')
    var compilations = document.getElementById('Compilations')


    arrowback.addEventListener('click', function (event) {
            window.history.go(-1)
    });

    imglogo.addEventListener('click', function (event) {
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


    categories.addEventListener('click', function (event) {
            if (categorylist.style.display = 'none') {
                categorylist.style.display = 'flex'
            } else if (categorylist.style.display = 'flex') {
                categorylist.style.display = 'none'
            }
    });


    
    window.document.onkeydown = key => {
        if (key.keyCode === 38) {
            var elem = document.querySelector('.focus');
            window.scrollTo(0, elem.offsetTop - 500);
        } else if (key.keyCode === 40) {
             var elem = document.querySelector('.focus');
             window.scrollTo(0, elem.offsetTop - 500);
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