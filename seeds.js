var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Mountain Goat's Rest",
        image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vehicula magna a tellus viverra ornare. Proin diam neque, efficitur tincidunt ante a, tempus ultrices leo. Donec eget convallis orci. Praesent viverra purus at ex tristique consequat. Suspendisse potenti. Vestibulum non semper augue. Donec ante ipsum, imperdiet et tempus vitae, aliquam at nunc. Nam arcu ex, consequat ac commodo quis, facilisis vitae urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis vitae fringilla neque. Etiam ut nisl felis. Duis vitae massa rutrum ante cursus viverra. Donec vestibulum nec turpis vitae dignissim."
    },
    {
        name: "Desert Mesa",
        image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vehicula magna a tellus viverra ornare. Proin diam neque, efficitur tincidunt ante a, tempus ultrices leo. Donec eget convallis orci. Praesent viverra purus at ex tristique consequat. Suspendisse potenti. Vestibulum non semper augue. Donec ante ipsum, imperdiet et tempus vitae, aliquam at nunc. Nam arcu ex, consequat ac commodo quis, facilisis vitae urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis vitae fringilla neque. Etiam ut nisl felis. Duis vitae massa rutrum ante cursus viverra. Donec vestibulum nec turpis vitae dignissim."
    },
    {
        name: "Canyon Floor",
        image: "https://images.unsplash.com/photo-1499363536502-87642509e31b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vehicula magna a tellus viverra ornare. Proin diam neque, efficitur tincidunt ante a, tempus ultrices leo. Donec eget convallis orci. Praesent viverra purus at ex tristique consequat. Suspendisse potenti. Vestibulum non semper augue. Donec ante ipsum, imperdiet et tempus vitae, aliquam at nunc. Nam arcu ex, consequat ac commodo quis, facilisis vitae urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis vitae fringilla neque. Etiam ut nisl felis. Duis vitae massa rutrum ante cursus viverra. Donec vestibulum nec turpis vitae dignissim."
    }
];

function seedDB(){

    //remove campgrounds
    Campground.deleteMany({}, function(err){
        if (err) { 
            console.log(err);
        } else {
            console.log("Removed campgrounds");

            //add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, data){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Added a campground!");

                        //add a few comments
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet.",
                                author: "Homer",
                            }, function(err, comment){
                                if (err) {
                                    console.log(err);
                                } else {
                                    data.comments.push(comment);
                                    data.save();
                                    console.log("Comment added.");
                                }
                            }
                        );
                    }
                });
            });
        }
    });
}

module.exports = seedDB;
