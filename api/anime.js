const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
var _ = require("lodash");
const router = express.Router();

router.get("/", function (req, res) {
  try {
    const APIANIME_TOKEN = "a88d97e1788ae00830c4665ab33b7f87";
    let APIANIME_URL = `https://bazon.cc/api/json?token=${APIANIME_TOKEN}&type=all&page=1&cat=аниме`;

    let fetchDataAnime = fetch(APIANIME_URL).then((response) => {
      return response.json();
    });

    const showAnime = async () => {
      try {
        const commits = await fetchDataAnime;
        let items = commits.results.map(
          (element) =>
            `{
            id: '${element.kinopoisk_id}',
            url: 'https://rr3---sn-aigl6nzk.googlevideo.com/videoplayback?expire=1681407957&ei=des3ZN-pCKOQmLAPof6KqAQ&ip=176.67.85.191&id=o-ANBsqefVOy7jVbx6tSUR4BXbiDotOvrrGYddXkf9mwgs&itag=22&source=youtube&requiressl=yes&mh=aB&mm=31%2C26&mn=sn-aigl6nzk%2Csn-5hneknek&ms=au%2Conr&mv=m&mvi=3&pl=24&initcwndbps=1008750&spc=99c5CaXE0iQIPXHxJLOUB9tDJ9UTgoADkCdXJzyZgg&vprv=1&mime=video%2Fmp4&ns=xzfCTH3MXcndTLxA3-1gJmcM&cnr=14&ratebypass=yes&dur=155.829&lmt=1655331954967271&mt=1681386056&fvip=2&fexp=24007246&c=WEB&txp=4532434&n=_LKabM0jDk3E4Q&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cspc%2Cvprv%2Cmime%2Cns%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRAIgMEhg67vhDupP5_caxFJztE8hn32-Mnk718I5oLPeInACIH5oxT-HSSFyl2Vpv-r1yjPuPbhU1tyywfT4yo31ZiMO&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAPjQSfudY8x1PFAP82K3F3cFbToYeUTWz1HhALrxm7ZXAiBbHDXs7SgO5KLSPdEGf_inrMUwMrnvKzNcA4MoNb3dtQ%3D%3D&title=JavaScript%20in%20100%20Seconds',
            type: 'vod',
            imgurl: '${element.info.poster}',
            title: '${element.info.rus}',
            created: '${element.info.year}',
            filmPageId: 'filmid${element.kinopoisk_id}',
            actors: '${element.info.actors}',
            director: '${element.info.director}',
            country: '${element.info.country}',
            text: '${element.info.description.replace(/[\n\r]+/g, "")}',
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
      const animeVideos = path.resolve("/public/js/anime/animeVideos.js");
      const animeFilmPage = path.resolve("/public/js/anime/animeFilmPage.js");
      fs.writeFile(
        animeVideos,
        `(function () {
    "use strict"

    window.App.videos = [
      ${movieItems}
    ] 
  })();
  `, (err) => {
    console.error(err)
  }
      );
      fs.writeFile(
        animeFilmPage,
        `(function () {
    "use strict"

    window.App.filmInfo = [
      ${movieItems}
    ] 
  })();
  `, (err) => {
    console.error(err)
  } 
      );

    }
    sendAnime();

    async function getAnime() {
      try {
        const videosId = await fetchDataAnime;
        // используем movies в шаблонной строке:

        videosId.results.map((item) => {
          router.get("/id=" + item.kinopoisk_id, (req, res) => {
            var id = req.url.split("=").pop();
            if (item.kinopoisk_id === id) {
              fetch(
                `https://bazon.cc/api/playlist?token=a88d97e1788ae00830c4665ab33b7f87&kp=${id}&ref=&ip=178.121.19.141`
              )
                .then((response) => {
                  return response.json();
                })
                .then(async (jsonResponse) => {
                  var data = jsonResponse.results[0].playlists;
                  var data2 = data[Object.keys(data)[0]];
                  var data3 = data2[Object.keys(data2)[0]];
                  var data4 =
                    data3[Object.keys(data3)[1]] ||
                    data3[Object.keys(data3)[0]];
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
        <script type="text/javascript" src="../src/libs/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="../src/libs/lodash.compat.min.js"></script>
        <script type="text/javascript" src="../src/libs/event_emitter.js"></script>
        <script type="text/javascript" src="../js/lib/smartbox.js"></script>
        <script type="text/javascript" src="../js/animevideos/animevideo.js"></script>
</head>
<style>
body {
  padding: 0;
  margin: 0;
}
.wrap {
  width: 100%;
  height: 100%;
  background-image: url(../images/stars.png);
}

</style>

<body>
  <div class="wrap">
    
  </div>
</body>
</html>`;

                  res.send(playerPage); // Отправка ответа в виде HTML
                });
            } else console.log("id !== videoid");
          });
        });

        res.sendFile("anime.html", {
          root: path.join(__dirname, "../public/pages/"),
        }); // Отправка ответа в виде HTML
      } catch (error) {
        console.error(error);
      }
    }

    getAnime();
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;

