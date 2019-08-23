var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

var app = express();

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

var PORT = process.env.PORT || 3000;

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

var exphbs = require("express-handlebars");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var db = require("./models")


app.get("/", function (req, res) {
    db.Article.find({}).then(function (dbArticle) {
        var hbsObject = {
            articles: dbArticle
        };
        res.render("index", hbsObject)
    })
        .catch(function (err) {
            res.json(err)
        })

})

app.get("/all", function (req, res) {
    db.Article.find({}, function (err, data) {
        if (err) throw err;
        res.json(data);
    });
});

//scrapes website for articles
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
        });
    });
});

//get route for rendering all articles in db
app.get("/articles", function (req, res) {
    db.Article.find({}).then(function (dbArticle) {
        var hbsObject = {
            articles: dbArticle
        };
        res.render("index", hbsObject)
    })
        .catch(function (err) {
            res.json(err)
        })

});

// update articles to mark as saved
app.post("/saved/:id", function (req, res) {
    db.Article.updateOne(
        {
            _id: mongojs.ObjectId(req.params.id)
        },
        {
            $set: {
                saved: true
            }
        },
        function (error, edited) {

            if (error) {
                console.log(error);
                res.send(error);
            }
            else {
                console.log(edited);
                res.send(edited);

            }

        }
    );
});

//updates articles to unsave them
app.post("/unsaved/:id", function (req, res) {
    db.Article.updateOne(
        {
            _id: mongojs.ObjectId(req.params.id)
        },
        {
            $set: {
                saved: false
            }
        },
        function (error, edited) {

            if (error) {
                console.log(error);
                res.send(error);
            }
            else {
                console.log(edited);
                res.send(edited);
            }
        }
    );
});


//renders all saved articles
app.get("/saved", function (req, res) {
    db.Article.find({
        saved: true
    }).then(function (dbArticle) {
        var hbsObject = {
            articles: dbArticle
        };
        res.render("saved", hbsObject)
    })
        .catch(function (err) {
            res.json(err)
        })
});


//get route for articles/comments
app.get("/articles/:id", function (req, res) {
    db.Article.findOne(
        {
            _id: req.params.id
        })
        .populate("comment")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err)
        })
});

// updates for comments
app.post("/articles/:id", function (req, res) {
    db.Comment.create(req.body)
        .then(function (dbComment) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                    comment: dbComment._id
                }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle)

        })
        .catch(function (err) {
            res.json(err)
        });
});

//clear database
app.get("/clear", function (req, res) {
    db.Article.remove({}, function (error, response) {
        if (error) {
            console.log(error);
            res.send(error);
        }
        else {
            console.log(response);
            res.send(response);
        }
    });
});

//removed comments
app.get("/comments/:id", function (req, res) {
    db.Comment.remove({
                _id: req.params.id
            } 
                
        )
        .then(function (dbArticle) {
            res.json(dbArticle)

        })
        .catch(function (err) {
            res.json(err)
        });
});

app.listen(PORT, function() {
    console.log("App running on port 3000!")
});
