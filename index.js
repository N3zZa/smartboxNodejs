const express = require("express");
const anime = require("./api/anime");
var app = express();
const path = require("path");
var _ = require("lodash");

app.use("/", express.static(path.join(__dirname + "/public/")));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") }); // Отправка ответа в виде HTML
});

app.use("/anime", anime);

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Server is listening on port ${port}`);
module.exports = app;

// rm -rf xyz - удалить репозиторий с амазон
