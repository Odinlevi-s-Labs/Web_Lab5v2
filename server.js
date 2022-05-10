var express = require("express");
var app = express();

app.use('/static', express.static(__dirname + "/static"));
app.set("view engine", "ejs");

var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true},
    function (error, client) {
    var blog = client.db("blog");
    console.log("DB connected");

    app.get("/", function(req, res) {
       res.send("Hello world");
    });

    app.get("/admin/dashboard", function (req, res) {
        res.render("admin/dashboard");
    });

    app.listen(3000, function () {
       console.log("Connected");
    });
});


