var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

var app = express();

// var databaseUrl = "scraper";
// var collections = ["scrapeData"];

mongoose.connect("mongodb://localhost/web-scraper", { useNewUrlParser: true });

var exphbs = require("express-handlebars");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var db = require("./models")
// var db = mongojs(databaseUrl, collections);

app.get("/", function (req, res) {
    res.render("index")
})

app.get("/all", function (req, res) {
    db.Article.find({}, function (err, data) {
        if (err) throw err;
        res.json(data);
    });
});

app.get("/articles/:id", function(req, res) {

    db.Article.findOne(
      {
        _id: req.params.id
      })
      .populate("comment")
      .then(function(dbArticle){
        res.json(dbArticle);
      })
      .catch(function(err){
        res.json(err)
      })
    });


app.post("/articles/:id", function(req, res) {

    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findOneAndUpdate({
        _id: req.params.id
        }, { $set: {
        note: dbNote._id
        }}, {new: true});
    })
    .then(function(dbArticle){
        res.json(dbArticle)
        
    })
    .catch(function(err){
        res.json(err)
    });
});
    

app.get("/scraper", function (req, res) {
    axios.get("https://www.indiewire.com/c/film/").then(function (response) {
        var $ = cheerio.load(response.data);

        $(".article-row").each(function (i, element) {

            var result = {}

            result.title = $(this).children(".post-right").children("div").children("header").children("h2").children("a").text();

            result.summary = $(this).children(".post-right").children("div").children("div").children("p").text()

            result.link = $(this).children(".post-left").children("a").attr("href");

            result.img = $(this).children(".post-left").children("a").children("img").attr("src");

            db.Article.create(result)
                .then(function (newArticle) {
                    console.log(newArticle)
                })
                .catch(function (err) {
                    console.log(err)
                })

            // db.scrapeData.insert({
            //     title: title,
            //     link: link,
            //     summary: summary,
            //     image: image
            // }, function (err, data) {
            //     if (err) throw new err;
            // });
            // console.log(title);
            // console.log(summary);
            // console.log(image)
            // console.log(link)
        });
    });
});

app.get("/articles", function (req, res) {
    db.Article.find({}).then(function (dbArticle) {
        // res.json(dbArticle);
        var hbsObject = { 
            articles: dbArticle
        };
        res.render("index", hbsObject)
    })
        .catch(function (err) {
            res.json(err)
        })

});

// router.get("/", function(req, res) {
//     cat.all(function(data) {
//       var hbsObject = {
//         cats: data
//       };
//       console.log(hbsObject);
//       res.render("index", hbsObject);
//     });
//   });

app.listen(3000, function () {
    console.log("App running on port 3000!");
});
