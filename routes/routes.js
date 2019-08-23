var router = require("express").Router()
var db = require("../models")
var axios = require("axios");
var cheerio = require("cheerio");
var mongojs = require("mongojs");

router.get("/", function (req, res) {
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

router.get("/all", function (req, res) {
    db.Article.find({}, function (err, data) {
        if (err) throw err;
        res.json(data);
    });
});

//scrapes website for articles
router.get("/scraper", function (req, res) {
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
router.get("/articles", function (req, res) {
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
router.post("/saved/:id", function (req, res) {
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
router.post("/unsaved/:id", function (req, res) {
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
router.get("/saved", function (req, res) {
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
router.get("/articles/:id", function (req, res) {
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
router.post("/articles/:id", function (req, res) {
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
router.get("/clear", function (req, res) {
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
router.get("/comments/:id", function (req, res) {
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

module.exports = router;