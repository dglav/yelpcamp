var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/", function(req, res){
    // Get all campgrounds from db
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds:allCampgrounds, currentUser:req.user });
        }
    });
});

router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

router.post("/", isLoggedIn, function(req, res){
    var newCampground = {
        name: req.body.name, 
        image: req.body.image, 
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    Campground.create(newCampground, (err, newCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT
router.get("/:id/edit", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
            res.redirect("campgrounds/" + req.params.id);
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

router.put("/:id", function(req, res){
    Campground.updateOne({ _id: req.params.id }, req.body.campground, function(err){
        if (err) {
            console.log(err);
        } else {
            // update
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// DESTROY
router.delete("/:id", function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err, deletedCampground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            deletedCampground.comments.forEach(function(comment){
                Comment.findByIdAndDelete(comment._id, function(err, deletedComment){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Deleted comment by: " + deletedComment.username);
                    }
                });
            });
            res.redirect("/campgrounds");
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
