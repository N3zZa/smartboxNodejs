const API_KEY = 'a7e00fb04d6aee85906efd13422fc24a';
const API_URL = `https://bazon.cc/api/json?token=${API_KEY}&type=film&page=2&cat=аниме`;

/* getMovies(API_URL);
 */
/* async function getMovies(url) {
    return new Promise(function (resolve, reject) {
        fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    })
} */

var xhr = new XMLHttpRequest();
xhr.open("GET", API_URL, true);
xhr.send()
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      showMovies(JSON.parse(xhr.responseText));
    } else {
      console.error(xhr.statusText);
    }
  }
};

function showMovies(data) {
    const moviesEl = document.getElementById("movies");
   /*  data.results.forEach(movie => {
        const movieEl = document.createElement('div')
        movieEl.className = "nv-el";
        movieEl.setAttribute("nv-el", "");
        const img = document.createElement('img')
        img.setAttribute('src', movie.info.poster)
        img.setAttribute('alt', 'img');

        const filmTitle = document.createElement("div");
        filmTitle.className = 'film-title'

        const h2 = document.createElement("h2");
        h2.appendChild(document.createTextNode(movie.info.rus));

        const p = document.createElement("p");
        p.appendChild(document.createTextNode(movie.info.rating.rating_imdb));

        filmTitle.appendChild(h2)
        filmTitle.appendChild(p);

        const year = document.createElement("p");
        year.appendChild(document.createTextNode(movie.info.year));

        movieEl.appendChild(img);
        movieEl.appendChild(filmTitle);
        movieEl.appendChild(year);

        moviesEl.appendChild(movieEl);
    }) */
    let i = 0;
    while (i < data.results.length) {
      const movieEl = document.createElement("div");
      movieEl.className = "nv-el";
      movieEl.setAttribute("nv-el", "");
      const img = document.createElement("img");
      img.setAttribute("src", data.results[i].info.poster);
      img.setAttribute("alt", "img");

      const filmTitle = document.createElement("div");
      filmTitle.className = "film-title";

      const h2 = document.createElement("h2");
      h2.appendChild(document.createTextNode(data.results[i].info.rus));

      const p = document.createElement("p");
      p.appendChild(
        document.createTextNode(data.results[i].info.rating.rating_imdb)
      );

      filmTitle.appendChild(h2);
      filmTitle.appendChild(p);

      const year = document.createElement("p");
      year.appendChild(document.createTextNode(data.results[i].info.year));

      movieEl.appendChild(img);
      movieEl.appendChild(filmTitle);
      movieEl.appendChild(year);

      moviesEl.appendChild(movieEl);
      i++
    }

    moviesEl.firstElementChild.setAttribute("nv-el-current", "true");
}
