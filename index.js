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
          `
          \`<div id='${element.kinopoisk_id}' class='movieitem navigation-item nav-item video-item' data-url="https://rr1---sn-cpux-30oe.googlevideo.com/videoplayback?expire=1680802992&ei=ULAuZLj9FaHX7QTp5Za4Dg&ip=194.32.122.48&id=o-AOqnm9y7WWA5No66guKAjXWpsxYeSgTqJxsNB_qnn0L7&itag=22&source=youtube&requiressl=yes&mh=aB&mm=31%2C29&mn=sn-cpux-30oe%2Csn-f5f7lnld&ms=au%2Crdu&mv=m&mvi=1&pl=25&initcwndbps=313750&spc=99c5CX926vV_WZiAUURkzezSrgdcn9XhVC93GVCJfA&vprv=1&mime=video%2Fmp4&ns=1yj2Y2cZBCMV64jv_sVicM4M&cnr=14&ratebypass=yes&dur=155.829&lmt=1655331954967271&mt=1680781028&fvip=1&fexp=24007246&c=WEB&txp=4532434&n=PaFLW1zgkV9DiA&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRgIhAOdkeIMZTJeGHJ7wWWcKGu4KvqN04ajOyW4qyeX6n-G0AiEAgeoAfrmDGNYzR8npBI3Aszl97IRRdo5Pl48u6copwLs%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhAIJAdO-crx7WqFcXvOgmATPBgLkjw1kWnfNxxvUkqCe9AiEAmy99mObud0hfVj9pMH6O4l_iiNpr-uqboetvinxyUiE%3D&title=JavaScript%20in%20100%20Seconds" data-type="{{type}}">
          <img id='imglogo' src='https://kinopoiskapiunofficial.tech/images/posters/kp/${element.kinopoisk_id}.jpg' />
          <h4>${element.ru_title}</h4>
          <p>${element.created}</p>
          </div>\`
        `
      );
      return items;
    } catch (error) {
      console.error(error);
    }
  };
  
 


async function getAnime() {
  try {
    // используем movies в шаблонной строке:
    const movies = await showAnime();
    fs.writeFileSync(
      "./js/scenes/anime/videos.js",
      `let animeArr = [${movies}]`
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
    <script type="text/javascript" src="./js/scenes/navigation.js"></script>
    <script type="text/javascript" src="./js/scenes/input.js"></script>
    <script type="text/javascript" src="./js/scenes/anime/videos.js"></script>

    
  <script type="text/javascript">

    


    (function () {
      'use strict'
  var _inited;
  _.templateSettings.interpolate = /\{\{([\s\S]+?)\}\}/g;


    let animeItems = [
    {
      title: "video",
      url: "https://rr1---sn-cpux-30oe.googlevideo.com/videoplayback?expire=1680802992&ei=ULAuZLj9FaHX7QTp5Za4Dg&ip=194.32.122.48&id=o-AOqnm9y7WWA5No66guKAjXWpsxYeSgTqJxsNB_qnn0L7&itag=22&source=youtube&requiressl=yes&mh=aB&mm=31%2C29&mn=sn-cpux-30oe%2Csn-f5f7lnld&ms=au%2Crdu&mv=m&mvi=1&pl=25&initcwndbps=313750&spc=99c5CX926vV_WZiAUURkzezSrgdcn9XhVC93GVCJfA&vprv=1&mime=video%2Fmp4&ns=1yj2Y2cZBCMV64jv_sVicM4M&cnr=14&ratebypass=yes&dur=155.829&lmt=1655331954967271&mt=1680781028&fvip=1&fexp=24007246&c=WEB&txp=4532434&n=PaFLW1zgkV9DiA&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRgIhAOdkeIMZTJeGHJ7wWWcKGu4KvqN04ajOyW4qyeX6n-G0AiEAgeoAfrmDGNYzR8npBI3Aszl97IRRdo5Pl48u6copwLs%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhAIJAdO-crx7WqFcXvOgmATPBgLkjw1kWnfNxxvUkqCe9AiEAmy99mObud0hfVj9pMH6O4l_iiNpr-uqboetvinxyUiE%3D&title=JavaScript%20in%20100%20Seconds",
      type: "vod",
    },
    {
      title: "video",
      url: "https://rr3---sn-p5qlsny6.googlevideo.com/videoplayback?expire=1680727196&ei=PIgtZJHmDqaP_9EPoM2UwAs&ip=216.131.104.167&id=o-AEv-T1zNClZxG0ChBg5SVOPBj_wqZ_6vQCqb66y58XWu&itag=22&source=youtube&requiressl=yes&mh=ua&mm=31%2C29&mn=sn-p5qlsny6%2Csn-p5qs7n6d&ms=au%2Crdu&mv=u&mvi=3&pl=25&spc=99c5CZTOXkGxCaGPI6So40avNAtxkXqYwxGTUovejQ&vprv=1&mime=video%2Fmp4&ns=sbx_5UoYz86WHRgjIUoLQ68M&cnr=14&ratebypass=yes&dur=311.727&lmt=1674161288557761&mt=1680704625&fvip=3&fexp=24007246&c=WEB&txp=5432434&n=xx9bdF4mjWLEeg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIhAPMWYSt8-7jeAJ0j09OKvyzPnHWDv6_tpyHWc17UKO6kAiAGHqrD4nLuJ5ai2gQtHOzO4MVQWVuVRAuipQ6_ZZnn7g%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl&lsig=AG3C_xAwRQIgUtpUcM0m4VgUtGWu2MaN2C6dFABMbs0gbE8aLxB9oZICIQC550q0aNb3on1U-PE5V0SMQLR_sJtAIN37h8tGcxS62Q%3D%3D&title=What%20is%20JavaScript%3F",
      type: "vod",
    },
  ];

window.App.videos = [];
for (var j = 0; j < animeItems.length; j++) {
       window.App.videos.push(animeItems[j]);
}
 


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
      var html = '';
        for (var j = 0; j < items.length; j++) {
          html += animeArr[2]
        }
        this.$el.empty().html(html);
    },
  };
})();


    </script>
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