var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

router.get("/", function(req, res){
    res.render("landing");
});

// ===========
// AUTH ROUTES
// ===========

//show register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});

router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err) {
            req.flash("error", err.message);
            res.redirect("/register");
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Yelpcamp, " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login", {page: 'login'});
});

//submit login form
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){});

//logout
router.get("/logout", middleware.isLoggedIn, function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;
