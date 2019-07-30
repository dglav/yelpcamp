var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    var campgrounds = [
        {name: "Salmon Creek", image: "https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732b7fdc9745c151_340.jpg"},
        {name: "Granite Hill", image: "https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c732b7fdc9745c151_340.jpg"},
        {name: "Mountain Goat's Rest", image: "https://pixabay.com/get/50e9d4474856b108f5d084609620367d1c3ed9e04e50744f712b72d29349c1_340.jpg"}
    ]

    res.render("campgrounds", {campgrounds:campgrounds});
});

app.listen(3000, function(){
    console.log("YelpCamp server has started!");
});