var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat_app", {useNewUrlParser: true });

var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

// george = new Cat({
//     name: "Mrs. Norris",
//     age: 7,
//     temperament: "Evil"
// });

// george.save(function(err, cat){
//     if (err) {
//         console.log("Something went wrong when saving the cat!");
//     } else {
//         console.log("We just saved a cat to the database: ");
//         console.log(cat.name);
//     }
// });

Cat.create({
    name: "Snow White",
    age: 15,
    temperament: "Bland"
}, (err, cat) => {
    if (err) {
        console.log(err);
    } else {
        console.log(cat);
    }
});

Cat.find({}, function(err, cats){
    if (err) {
        console.log("Oh no, error!");
        console.log(err);
    } else {
        console.log("All the cats!");
        cats.forEach( (cat) => console.log(cat.name) );
    }
});