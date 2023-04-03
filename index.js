const express = require("express");
const fetch = require("node-fetch");
var app = express();
const path = require("path");

app.use(express.static(__dirname));

const APIANIME_TOKEN = "tiZIrLKGr6cEDt2zQekNOTQyB3uVNscj";
const APIANIMEVIDEO_TOKEN = "a88d97e1788ae00830c4665ab33b7f87";
let APIANIME_URL = `https://videocdn.tv/api/animes?api_token=${APIANIME_TOKEN}`;

const fetchDataAnime = fetch(APIANIME_URL).then((response) => {
  return response.json();
});

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const getTodosSeries = async function () {
  const videos = await fetchDataAnime;
  let results = [];
  for (let index = 0; index < videos.data.length; index++) {
    await delay();
    const fetchDataAnimeVideos = fetch(
      `https://bazon.cc/api/playlist?token=${APIANIMEVIDEO_TOKEN}&kp=${videos.data[index].kinopoisk_id}`
    )
      .then((response) => response.json())
      .then((data) => results.push(data));
  }
  return results;
};



const showAnime = async () => {
  try {
    const results = await getTodosSeries();
    const AppVideos = [];
    let animeItems = results.map((element) => { 
        `{
            title: 'video',
            url: '${
              element.results[0] ? element.results[0].playlists[
                Object.keys(element.results[0].playlists)[
                  Object.keys(element.results[0].playlists).length - 1
                ]
              ] : 'no url available'
            }',
            type: "vod",
          };`;
    });
    AppVideos.push(animeItems);
    console.log(animeItems);
    const commits = await fetchDataAnime;
    let items = commits.data.map(
      (element) =>
        `
        <script>
        window.App.videos = ${AppVideos}
          </script>
          <div class='movieitem navigation-item nav-item video-item'>
          <img id='imglogo' src='https://kinopoiskapiunofficial.tech/images/posters/kp/${element.kinopoisk_id}.jpg' />
          <h4>${element.ru_title}</h4>
          <p>${element.created}</p>
          </div>

      `
    );
    return items;
  } catch (error) {
    console.error(error);
  }
};

async function getAnime() {
  try {
    const movies = await showAnime();
    const moviesItems = movies.join("");

    // используем movies в шаблонной строке:
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
    <script type="text/javascript" src="./js/scenes/videos.js"></script>
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
            <img class='navigation-item nav-item' onclick="window.location.href = '/'" width="75" src="../../images/UconCinemaLogo.png" alt="logoimg">
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
    <div id="movies" class="navbar navigation-items js-scene-video" data-nav_loop="true">
    ${moviesItems}
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
