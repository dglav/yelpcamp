var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname));  //need this line to route to subfolders in local drive\

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// campground = Campground.create({
//     name: "Mountain Goat's Rest", 
//     image: "https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424__340.jpg",
//     description: "OMG there are so many goats here! OMGGGG They ate Jimmy!"
// }, (err, campground) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Newly created campground: ");
//         console.log(campground);
//     }
// });

// { "_id" : ObjectId("5d46d5087c9d1f3c80b25971"), "name" : "Salmon Creek", "image" : "https://cdn.pixabay.com/photo/2016/11/21/15/14/camping-1845906__340.jpg", "__v" : 0 }
// { "_id" : ObjectId("5d46d54284f60840e078204a"), "name" : "Granite Hill", "image" : "https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092__340.jpg", "__v" : 0 }
// { "_id" : ObjectId("5d46d567df72a81c28ac4b6f"), "name" : "Mountain Goat's Rest", "image" : "https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424__340.jpg", "__v" : 0 }
// { "_id" : ObjectId("5d46d7cadc54473f7071e467"), "name" : "Dusty Trail", "image" : "https://cdn.pixabay.com/photo/2015/11/07/11/39/camping-1031360__340.jpg", "__v" : 0 }

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    // Get all campgrounds from db
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds:allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var newCampground = {name: name, image: image, description: desc};
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

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(3000, function(){
    console.log("YelpCamp server has started!");
});


// RESTFUL ROUTS

// NAME     URL            VERB    DESC
// -----------------------------
// INDEX   /dogs           GET    Display a list of all dogs
// NEW     /dogs/new       GET   Displays form to make a new dog
// CREATE  /dogs          POST   Add a new dog to the DB
// SHOW    /dogs/:id       GET   Shows info about one dog