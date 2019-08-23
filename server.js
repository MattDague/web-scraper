var express = require("express");

var mongoose = require("mongoose");

var app = express();
var routes = require("./routes/routes")


var PORT = process.env.PORT || 3000;

// mongoose.set('useCreateIndex', true);
// mongoose.set('useFindAndModify', false);

var exphbs = require("express-handlebars");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(routes);

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.listen(PORT, function() {
    console.log("App running on port 3000!")
});
