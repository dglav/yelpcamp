/**
 * Study comments:
 * - The reference in the comments array of this model needs to be exactly the same as the model name in the comment schema. 
 *      The model name of the schema is the first input into the mongoose.model() command. Since I defined it as lowercase 
 *      in theh comment.js file, the ref here must be lowercase as well.
 */

var mongoose = require("mongoose");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    location: String,
    lat: Number,
    lon: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);
