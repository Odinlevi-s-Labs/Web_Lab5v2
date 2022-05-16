var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var ObjectId = require("mongodb").ObjectId;

var formidable = require("formidable");
var fs = require("fs");
var session = require("express-session");
app.use(session({
    key: "admin",
    secret: "return from abyss"
}));

app.use('/static', express.static(__dirname + "/static"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true},
    function (error, client) {
    var blog = client.db("blog");
    console.log("DB connected");

    app.get("/", function(req, res) {
        blog.collection("posts").find().sort({"_id": -1}).toArray(function (error, posts) {
            res.render("user/home", {posts: posts});
        });
    });

    app.get("/do-logout", function(req, res) {
        req.session.destroy();
        res.redirect("/admin");
    });

    app.get("/admin/dashboard", function (req, res) {
        if (req.session.admin) {
            res.render("admin/dashboard");
        } else {
            res.redirect("/admin");
        }
    });

    app.get("/admin", function (req, res) {
        res.render("admin/login");
    });

    app.get("/admin/posts", function (req, res) {
        if (req.session.admin) {
            res.render("admin/posts");
        } else {
            res.redirect("/admin");
        }
    });

    app.post("/do-admin-login", function (req, res) {
       blog.collection("admins").findOne({"email": req.body.email, "password": req.body.password}, function (error, admin) {
            if (admin != "") {
                req.session.admin = admin;
            }
            res.send(admin);
       });
    });

    app.post("/do-post", function (req, res) {
        blog.collection("posts").insertOne(req.body, function (error, document) {
            res.send({});
        });
    });

    app.get("/posts/:id", function (req, res) {
        blog.collection("posts").findOne({"_id": ObjectId(req.params.id)},
            function (error, post) {
                res.render("user/post", {post: post});
        });
    });

    app.post("/do-comment", function (req, res) {
        blog.collection("posts").updateOne({ "_id": ObjectId(req.body.post_id) }, {
            $push: {
                "comments": {username: req.body.username, comment: req.body.comment}
            }
        }, function (error, post) {
            res.send("comment successful");
        });
    });

    app.post("/do-upload-image", function(req, res) {
        var formData = new formidable.IncomingForm();
        formData.parse(req, function (error, fields, files) {
            var oldPath = files.file.filepath;
            var newPath = "static/images/" + files.file.newFilename;

           fs.rename(oldPath, newPath, function (err) {
              res.send("/" + newPath);
           });
        });
    });

    app.listen(3000, function () {
       console.log("Connected");
    });
});


