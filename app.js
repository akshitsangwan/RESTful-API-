//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

// ************************Requests Targeting All Articles************************

app.route("/articles")
.get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
        if(err)
            res.send(err);
        else
            res.send(foundArticles);
    });
})
.post(function (req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err) {
        if(err)
            res.send(err);
        else
            res.send("Succssfully added a new article!");
    });
})
.delete(function (req, res) {
    Article.deleteMany({}, function(err) {
        if(err)
            res.send(err);
        else
            res.send("Succssfully deleted all articles.");
    });
});

// ************************Requests Targeting A Specific Article************************

app.route("/articles/:articleTitle")
.get(function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
        if(err)
            res.send(err);
        else
            res.send(foundArticle);
    });
})
.put(function(req, res) {
    Article.updateOne({title: req.params.articleTitle}, {$set: req.body}, function(err) {
        if(err)
            res.send(err);
        else
            res.send("Article updated successfully!");
    });
})
.patch(function(req, res) {
    Article.updateOne({title: req.params.articleTitle}, {title: req.body.title, content: req.body.content}, function(err) {
        if(err)
            res.send(err);
        else
            res.send("Article updated successfully!");
    });
})
.delete(function(req, res) {
    Article.deleteOne({title: req.params.articleTitle}, function(err) {
        if(err)
            res.send(err);
        else
            res.send("Article deleted successfully!");
    });
});

app.listen(3000,function() {
    console.log("Server started on port 3000");
});