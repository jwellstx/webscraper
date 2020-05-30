const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function (app) {
    // when landing on the main page, show the 'active' articles
    app.get("/", (req, res) => {
        db.Article.find({active: true, saved: false}).then(resp => {
            res.render("index", {results: resp.map(article => article.toJSON())});
        });
    });

    // when "saved articles" clicked, show all documents that have saved:true
    app.get("/savedArticles", (req, res) => {
        db.Article.find({saved: true}).then(resp => {
            res.render("notes", {results: resp.map(article => article.toJSON())})
        });
    });
}