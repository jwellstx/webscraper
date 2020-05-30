// used to handle routes and display pages
const express = require("express");
const exphbs = require("express-handlebars");
// for connection to DB
const mongoose = require("mongoose");

// Require models
const db = require("./models");

// Init express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// connect to mongo db
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

// routes - make a routing file later
require("./routes/api-routes.js")(app);
require("./routes/view-routes.js")(app);

app.listen(PORT, function () {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
});