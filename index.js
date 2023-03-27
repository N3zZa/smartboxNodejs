const express = require("express");
const fetch = require("node-fetch");
var app = express();
const path = require("path");

app.use(express.static(__dirname + "/public/"));


const API_KEY = "a7e00fb04d6aee85906efd13422fc24a";
let API_URL = `https://bazon.cc/api/json?token=${API_KEY}&type=film&page=2&cat=аниме`;

    const fetchData = fetch(API_URL).then((response) => {
      return response.json();
    });


 const showMovies = async () => {
   try {
    const commits = await fetchData;
      let items = commits.results.map((element) => 
      `<div nv-el class='movieitem'>
        <img src='${element.info.poster}' alt='imglogo' />
        <h4>${element.info.rus}</h4>
        <p>${element.info.year}</p>
      </div>`
    );
      return items;
   } catch (error) {
     console.error(error);
   }
 };

 async function getMovies() {
   try {
     const movies = await showMovies();
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
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 20px;
    margin-top: 30px;
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
                <a href="../pages/Films.html">
                    <li nv-el>Фильмы</li>
                </a>
                <a href="../pages/Serials.html">
                    <li nv-el>Сериалы</li>
                </a>
                <a href="../pages/Cartoons.html">
                    <li nv-el>Мультфильмы</li>
                </a>
                <a href="../pages/Premieres.html">
                    <li nv-el>Премьеры</li>
                </a>
                <a href="../pages/Compilations.html">
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
    <script type="text/javascript" src="../navigation/navigation.js"></script>
    <script type="text/javascript" src="../navigation/navigation.min.js"></script>
</body>
</html>`;

     app.get("/anime", (req, res) => {
       res.sendFile(path.join(__dirname + "/public/views/anime.html"));
       res.send(message); // Отправка ответа в виде HTML
     });

   } catch (error) {
     console.error(error);
   }
 }

 getMovies();


app.get("/public/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Server is listening on port ${port}`);

module.exports = app;

// rm -rf xyz       - удалить репозиторий с амазон