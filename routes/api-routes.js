const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");
const mongoose = require("mongoose");

module.exports = function (app) {
    app.get("/scrape", (req, res) => {
        // each time we scrape new articles, set all items active to false
        db.Article.updateMany({}, { $set: { active: false } })
            .then(dbData => {
                // console.log("Setting everything to inactive for incoming new scrape");
            })
            .catch(err => {
                throw err;
            });

        // just for fun pick a random page
        const pageNum = Math.floor((Math.random() * 3)) + 1;  // page numbers are only 1 and up

        // Scrape the page
        axios.get("https://uncrate.com/" + pageNum).then(response => {
            var $ = cheerio.load(response.data);

            $(".article").each((i, element) => {
                let results = {};

                // grab title, link, summary, img and set active to true
                results.title = $(element).find("h1.article-title").text();
                results.link = $(element).find("h1.article-title a").attr("href");
                results.summary = $(element).find(".copy-wrapper p a").first().text();
                results.img = $(element).find(".image-wrapper a img").attr("data-retina");
                // this hook is used for when people land on the on the main page or refresh the page,
                // it will still show the latest scraped articles
                results.active = true;

                // if all information is found, update the database
                if (results.title && results.link && results.summary && results.img) {
                    // we are using update instead of create so we can update the active field
                    // if this article has already been scraped before but we dont want a new entry.
                    // else it will just create a new document using the 'upsert' field.
                    // also, only set the defaults (specifically for saved) on insert so we dont override if the 
                    // article has already been saved.
                    db.Article.updateOne({ title: results.title }, results, { upsert: true, setDefaultsOnInsert: true })
                        .then(dbArticle => {
                            // console.log("updated new scraped articles!");
                        })
                        .catch(err => {
                            throw err;
                        });
                }
            });
            // redirect back to home page to populate new scraped articles using handlebars
            res.redirect("/");
        });
    });

    app.post("/saveArticle", (req, res) => {
        // 5ed19e8ed548c8b31f57a6c7
        console.log("id to save: " + req.body.id);
        db.Article.updateOne({ _id: req.body.id }, { $set: { saved: true } })
            .then(dbData => {
                res.redirect("/");
            })
            .catch(err => {
                throw err;
            });
    });

    app.post("/saveNote", (req, res) => {
        db.Note.create({ note: req.body.note })
            .then(function (dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({_id: req.body.id }, { $push: { note: dbNote._id } }, { useFindAndModify: false });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.post("/getNotes", (req, res) => {
        db.Article.findOne({ _id: req.body.id })
            // ..and populate all of the notes associated with it
            .populate({path: "note", model: "Note"})
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                console.log("RETURN\n" + dbArticle);
                // res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    })
}