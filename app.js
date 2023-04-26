const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");
const articleSchema = {
    title: String,
    content: String
};
const Article = mongoose.model("Article", articleSchema);

///////// All articles 

app.route("/articles")
    .get(function(req, res){
        Article.find({})
            .then(function(foundArticles){
                res.send(foundArticles);
            })
            .catch(function(err){
                res.send(err); 
            });
    })
    .post(function(req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function(err){
            if(!err) {
                res.send("New article added.")
            }else{
                res.send(err);
            }
        });
    })
    .delete(function(req, res){
        Article.deleteMany({})
            .then(function(){
                res.send("Deleted all articles.");
            })
            .catch(function(err){
                res.send(err);
            });
    });

///////// Specific article

app.route("/articles/:articleTitle")
    .get(function(req, res){
        Article.findOne({title: req.params.articleTitle})
            .then(function(foundArticle){
                res.send(foundArticle);
            })
            .catch(function(err){
                res.send("No article was found.");
            });
    })
    .put(function(req, res){
        Article.updateOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content}
        )
        .then(function(){
            res.send("Article updated.");
        })
        .catch(function(err){
            res.send(err);
        });
    })
    .patch(function(req, res){
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body}
        )
        .then(function(){
            res.send("Article updated.");
        })
        .catch(function(err){
            res.send(err);
        });
    })
    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articleTitle}
        )
        .then(function(){
            res.send("Article deleted.");
        })
        .catch(function(err){
            res.send(err);
        });
    });

app.listen(3000, function(){
    console.log("Server started on port 3000.");
});