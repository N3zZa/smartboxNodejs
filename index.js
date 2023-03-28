const express = require("express");
const fetch = require("node-fetch");
var app = express();
const path = require("path");

app.use(express.static(__dirname + "/public/"));


const API_KEY = "a7e00fb04d6aee85906efd13422fc24a";
let APIANIME_URL = `https://bazon.cc/api/json?token=${API_KEY}&type=film&page=2&cat=аниме`;
let APIFILMS_URL = `https://bazon.cc/api/json?token=${API_KEY}&type=film&page=2&cat=аниме`;
let APISERIALS_URL = `https://bazon.cc/api/json?token=${API_KEY}&type=film&page=2&cat=аниме`;
let APIPREMIERES_URL = `https://bazon.cc/api/json?token=${API_KEY}&type=film&page=2&cat=аниме`;
let APICARTOONS_URL = `https://bazon.cc/api/json?token=${API_KEY}&type=film&page=2&cat=аниме`;

    const fetchDataAnime = fetch(APIANIME_URL).then((response) => {
      return response.json();
    });


 const showAnime = async () => {
   try {
    const commits = await fetchDataAnime;
      let items = commits.results.map(
        (element) =>
          `
          <iframe loading="lazy" allowfullscreen="true" webkitallowfullscreen="true" nv-el-current id="${element.kinopoisk_id}" style="display:none; position:absolute; left: 0; top:0;" src="https://25548813.svetacdn.in/gLTQyQJtC98L?kp_id=${element.kinopoisk_id}" frameborder="0"></iframe>
          <div nv-el class='movieitem' id='movieblock${element.kinopoisk_id}' onclick="
          let video${element.kinopoisk_id} = document.getElementById('${element.kinopoisk_id}'); 
          video${element.kinopoisk_id}.style.display = 'block'; 
          video${element.kinopoisk_id}.style.position = 'fixed'; 
          video${element.kinopoisk_id}.style.right = '0'; 
          video${element.kinopoisk_id}.style.bottom = '0'; 
          video${element.kinopoisk_id}.style.left = '0'; 
          video${element.kinopoisk_id}.style.width = '100%'; 
          video${element.kinopoisk_id}.style.height = '100%'; 
          video${element.kinopoisk_id}.style.margin = '0'; 
          video${element.kinopoisk_id}.contentWindow.focus()
          " >
          <img src='${element.info.poster}' alt='imglogo' />
          <h4>${element.info.rus}</h4>
          <p>${element.info.year}</p>
          </div>
          <script type='text/javascript'>
          let videoTv${element.kinopoisk_id} = document.getElementById('${element.kinopoisk_id}'); 
          let posterBlock${element.kinopoisk_id} = document.getElementById('movieblock${element.kinopoisk_id}')
            function getVideo${element.kinopoisk_id}() {
                videoTv${element.kinopoisk_id}.style.display = 'block'; 
          videoTv${element.kinopoisk_id}.style.position = 'fixed'; 
          videoTv${element.kinopoisk_id}.style.right = '0'; 
          videoTv${element.kinopoisk_id}.style.bottom = '0'; 
          videoTv${element.kinopoisk_id}.style.left = '0'; 
          videoTv${element.kinopoisk_id}.style.width = '100%'; 
          videoTv${element.kinopoisk_id}.style.height = '100%'; 
          videoTv${element.kinopoisk_id}.style.margin = '0'; 
                videoTv${element.kinopoisk_id}.contentWindow.focus()
            }
            posterBlock${element.kinopoisk_id}.addEventListener('nv-enter', function (event) {
                setTimeout(getVideo${element.kinopoisk_id}, 100)
            });
          </script>
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
     const moviesItems = movies.join('')

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

.movies {
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

.nv-el-current {
    outline: 5px solid yellow;
    outline-offset: -4px;
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
        <div nv-scope="movies" nv-scope-current="true" class="header">
        <img id="arrowback" nv-el nv-el-current onclick="window.history.go(-1)" width="50" src="../../images/arrowBack.svg"
            alt="arrowback">
        <a id="imglogo" nv-el href="/">
            <img width="75" src="../../images/UconCinemaLogo.png" alt="logoimg">
        </a>
        <div id="categories" nv-el class="categories">
            <h1>Категории</h1>
            <ul id="categorylist" class="category-list">
                <a id='Films' href="/films">
                    <li nv-el>Фильмы</li>
                </a>
                <a id='Serials' href="/serials">
                    <li nv-el>Сериалы</li>
                </a>
                <a id='Cartoons' href="/cartoons">
                    <li nv-el>Мультфильмы</li>
                </a>
                <a id='Premieres' href="/premieres">
                    <li nv-el>Премьеры</li>
                </a>
                <a id='Compilations' href="/compilations">
                    <li nv-el>Подборки</li>
                </a>
            </ul>
        </div>
        <h2>Аниме</h2>
    </div>
    <div id="movies" class="movies" nv-scope="movies">
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


    arrowback.addEventListener('nv-enter', function (event) {
            window.history.go(-1)
    });

    imglogo.addEventListener('nv-enter', function (event) {
            window.location='/'
    });


    cartoons.addEventListener('nv-enter', function (event) {
            window.location='/cartoons'
    });

    serials.addEventListener('nv-enter', function (event) {
            window.location='/serials'
    });

    films.addEventListener('nv-enter', function (event) {
            window.location='/films'
    });

    premieres.addEventListener('nv-enter', function (event) {
            window.location='/premieres'
    });

    compilations.addEventListener('nv-enter', function (event) {
            window.location='/compilations'
    });


    categories.addEventListener('nv-enter', function (event) {
            if (categorylist.style.display = 'none') {
                categorylist.style.display = 'flex'
            } else if (categorylist.style.display = 'flex') {
                categorylist.style.display = 'none'
            }
    });

    </script>
    <script type="text/javascript" src="../navigation/navigation.js"></script>
    <script type="text/javascript" src="../navigation/navigation.min.js"></script>
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

 

app.get("/public/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});



const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Server is listening on port ${port}`);

// rm -rf xyz - удалить репозиторий с амазон