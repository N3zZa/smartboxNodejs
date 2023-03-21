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
          console.log(data)
        })
        .catch((error) => {
          reject(error);
        });
    })
}   

function showMovies(data) {
    const moviesEl = document.querySelector(".movies")
}