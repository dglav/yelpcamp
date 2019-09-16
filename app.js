/**
 * Lessons Learned:
 *  - In order to use traverse local files, the application needs to know to look in the current working directory.
 *      Therefore, app.use(express.static(__dirname)); is required.
 */

require('dotenv').config();

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash       = require("connect-flash"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");
    app.locals.moment = require('moment');

var indexRoutes         = require("./routes/index"),
    campgroundRoutes    = require("./routes/campgrounds"),
    commentRoutes       = require("./routes/comments");

console.log("before mongoose");
console.log(process.env.DATABASE_URL);
console.log(typeof(process.env.DATABASE_URL));
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
console.log("after mongoose");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname));
app.use(flash());
// seedDB();

// Auth Configuration
app.use(require("express-session")({
    secret: "mindtrips are trippy",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Allow for PUT and DELETE routes
app.use(methodOverride("_method"));

// Make current user a global variable in locals
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Allow for shorter routes in each of the routes files below
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, function(){
    console.log("Yelpcamp server has started!");
});


// RESTFUL ROUTES

// NAME     URL            VERB    DESC
// -----------------------------------------------------------
// INDEX   /dogs           GET    Display a list of all dogs
// NEW     /dogs/new       GET   Displays form to make a new dog
// CREATE  /dogs          POST   Add a new dog to the DB
// SHOW    /dogs/:id       GET   Shows info about one dog

// NEW      campgrounds/:id/comments/new    GET
// CREATE   campgrounds/:id/comments        POST