var express = require("express");
var app = express();

var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true},
    function (error, client) {
    var blog = client.db("blog");
    console.log("DB connected");

    app.get("/", function(req, res) {
       res.send("Hello world");
    });

    app.listen(3000, function () {
       console.log("Connected");
    });
});


