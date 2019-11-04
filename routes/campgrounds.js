// Packages
var express = require("express");
var router = express.Router();

var NodeGeocoder = require("node-geocoder");

var options = {
    provider: "google",
    httpAdapter: "https",
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);

// Models
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Middleware
var middleware = require("../middleware");

// Campground root page
router.get("/", function (req, res) {
    // Get all campgrounds from db
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user });
        }
    });
});

// New campground form
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// New campground post route
router.post("/", middleware.isLoggedIn, function (req, res) {
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        } else {
            var newCampground = {
                name: req.body.name,
                price: req.body.price,
                image: req.body.image,
                location: data[0].formattedAddress,
                lat: data[0].latitude,
                lon: data[0].longitude,
                description: req.body.description,
                author: {
                    id: req.user._id,
                    username: req.user.username
                }
            }

            Campground.create(newCampground, (err, newCampground) => {
                if (err) {
                    console.log(err);
                    req.flash("error", "Something went wrong.");
                } else {
                    req.flash("success", "Added campground!");
                    res.redirect("/campgrounds");
                }
            });
        }
    });
});

// Show Details
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", { campground: foundCampground });
        }
    });
});

router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    var editedCampground = req.body.campground;

    Campground.findById(req.params.id, function (err, foundCampground) {
        console.log(req.body.campground.location);
        if (err) {
            console.log(err);
            req.flash('error', "Database error");
            return res.redirect('back');
        } else {
            if (foundCampground.location !== req.body.campground.location) {
                geocoder.geocode(req.body.campground.location, function (err, data) {
                    if (err || !data.length) {
                        console.log(err);
                        req.flash('error', 'Invalid address');
                        return res.redirect('back');
                    } else {
                        console.log("geocoding!");
                        editedCampground.location = data[0].formattedAddress;
                        editedCampground.lat = data[0].latitude;
                        editedCampground.lon = data[0].longitude;
                    }
                }).then(function () {
                    console.log(editedCampground);
                    Campground.updateOne({ _id: req.params.id }, editedCampground, function (err) {
                        if (err) {
                            console.log(err);
                            req.flash("error", "Something went wrong.");
                            return res.redirect('back');
                        } else {
                            // update
                            req.flash("success", "Successfully edited campground!");
                            res.redirect("/campgrounds/" + req.params.id);
                        }
                    });
                });
            }
        }
    });
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndDelete(req.params.id, function (err, deletedCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            deletedCampground.comments.forEach(function (comment) {
                Comment.findByIdAndDelete(comment._id, function (err, deletedComment) {
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
