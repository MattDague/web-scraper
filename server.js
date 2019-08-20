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
    axios.get("https://www.espn.com/esports/").then(function (response) {
        var $ = cheerio.load(response.data);

        $(".contentItem__content").each(function (i, element) {
            var title = $(element).children("a").children("div").children("div").children("h1").text()
            var link = $(element).children("a").attr("href");

            db.scrapeData.insert({
                title: title,
                link: link
            }, function (err, data) {
                if (err) throw new err;
            });
            console.log(title);
            console.log(link)
        });
    });
});

app.listen(3000, function () {
    console.log("App running on port 3000!");
});
