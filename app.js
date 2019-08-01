var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname));  //need this line to route to subfolders in local drive\

var campgrounds = [
    {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/11/21/15/14/camping-1845906__340.jpg"},
    {name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092__340.jpg"},
    {name: "Mountain Goat's Rest", image: "https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424__340.jpg"},
    {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/11/21/15/14/camping-1845906__340.jpg"},
    {name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092__340.jpg"},
    {name: "Mountain Goat's Rest", image: "https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424__340.jpg"},
    {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/11/21/15/14/camping-1845906__340.jpg"},
    {name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092__340.jpg"},
    {name: "Mountain Goat's Rest", image: "https://cdn.pixabay.com/photo/2015/03/26/10/29/camping-691424__340.jpg"}
];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    campgrounds.push({name: name, image: image});
    res.redirect("campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.listen(3000, function(){
    console.log("YelpCamp server has started!");
});