var Campground  = require("../models/campground");
    Comment     = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                req.flash("error", err.message);
                res.redirect("/campgrounds/" + req.body.id);
            } else if (!foundCampground) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that!");
        res.redirect("/campgrounds/" + req.params.id);
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                req.flash("error", "Comment not found.");
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that!");
        res.redirect("/campgrounds/" + req.params.id);
    }
}

module.exports = middlewareObj;