var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");

var app = express();

var databaseUrl = "scraper";
var collections = ["scrapeData"];

var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("database error: ", error);
});

app.get("/", function (req, res) {
    res.render("index")
})

app.get("/all", function (req, res) {
    db.scrapeData.find({}, function (err, data) {
        if (err) throw err;
        res.json(data);
    });
});

app.get("/scraper", function (req, res) {
    axios.get("https://www.indiewire.com/c/film/").then(function (response) {
        var $ = cheerio.load(response.data);

        $(".article-row").each(function (i, element) {
            var title = $(element).children(".post-right").children("div").children("header").children("h2").children("a").text()
            var summary = $(element).children(".post-right").children("div").children("div").children("p").text()
            var link = $(element).children(".post-left").children("a").attr("href");
            var image = $(element).children(".post-left").children("a").children("img").attr("src");

            // db.scrapeData.insert({
            //     title: title,
            //     link: link
            // }, function (err, data) {
            //     if (err) throw new err;
            // });
            console.log(title);
            console.log(summary);
            console.log(image)
            console.log(link)
        });
    });
});

app.listen(3000, function () {
    console.log("App running on port 3000!");
});
