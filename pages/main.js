const API_KEY = 'a7e00fb04d6aee85906efd13422fc24a';
const API_URL = `https://bazon.cc/api/json?token=${API_KEY}&type=film&page=2&cat=аниме`;

getMovies(API_URL);

async function getMovies(url) {
    return new Promise(function (resolve, reject) {
        fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          resolve(data);
          showMovies(data)
        })
        .catch((error) => {
          reject(error);
        });
    })
}   

function showMovies(data) {
    const moviesEl = document.querySelector(".movies")
    data.results.forEach(movie => {
        const movieEl = document.createElement('div')
        movieEl.classList.add("movie", "nv-el");
        movieEl.setAttribute("nv-el", "");
        movieEl.innerHTML = `
        <div class="item">
                <img src="${movie.info.poster}" alt="img">
                <div class="film-title">
                    <h2>${movie.info.rus}</h2>
                    <p>${movie.info.rating.rating_imdb}</p>
                </div>
                <p>${movie.info.year}</p>
            </div>
        `;
        moviesEl.appendChild(movieEl);
    })
    moviesEl.firstElementChild.setAttribute("nv-el-current", "true");
}
