var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname));  //need this line to route to subfolders in local drive\

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// campground = Campground.create({
//     name: "Mountain Goat's Rest", 
//     image: "https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424__340.jpg"
// }, (err, campground) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Newly created campground: ");
//         console.log(campground);
//     }
// });

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    // Get all campgrounds from db
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds:allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    Campground.create(newCampground, (err, newCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("campgrounds");
        }
    })
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.listen(3000, function(){
    console.log("YelpCamp server has started!");
});