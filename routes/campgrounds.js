var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Campground root page
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

// New campground form
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// New campground post route
router.post("/", middleware.isLoggedIn, function(req, res){
    var newCampground = {
        name: req.body.name, 
        price: req.body.price,
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
            req.flash("error", "Something went wrong.");
        } else {
            req.flash("success", "Added campground!");
            res.redirect("/campgrounds");
        }
    });
});

// Show Details
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    req.body.campground.createdAt = Date.now();
    Campground.updateOne({ _id: req.params.id }, req.body.campground, function(err){
        if (err) {
            req.flash("error", "Something went wrong.");
            console.log(err);
        } else {
            // update
            req.flash("success", "Successfully edited campground!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
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

module.exports = router;
