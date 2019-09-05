var express = require("express");
var router = express.Router({ mergeParams: true });  // When accessing params from the parent router, the mergeParams option is required.
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create({
                author: {
                    id: req.user._id,
                    username: req.user.username
                },
                text: req.body.comment.text
            }, function(err, comment){
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

//Update
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/edit", {
                campgroundId: req.params.id,
                comment: comment
            });
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            console.log(err);
        } else {
            console.log(updatedComment);
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // Delete association to comment
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            foundCampground.comments = foundCampground.comments.filter(function(value, index, arr){
                return !value.equals(req.params.comment_id);
            });
            foundCampground.save();

            // Delete comment itself
            Comment.findByIdAndDelete(req.params.comment_id, function(err){
                if (err) {
                    res.redirect("back");
                } else {
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

module.exports = router;
