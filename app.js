//import and set the app to use the required declarations.
var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose")

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true}); //connect and create the mongodb
app.use(bodyParser.urlencoded({extended: true}));
//set the view engine
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

//compile it into a 'model'
var Campground = mongoose.model("Campground", campgroundSchema);

//create a campground
// Campground.create(
//       {
//           name: "Tinapa Resort", 
//           image: "https://source.unsplash.com/F4GGnyJ8aiI",
//           description: "This is a huge granite hill in Nigeria, no bathrooms, no water granite."
                
//  }, function(err, campground){ //callback function
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATED CAMPGROUND: ");
//             console.log(campground);
//         }
// });


//create the Root route
app.get("/", function(req, res) {
    res.render("landing");
});


//INDEX Route - show all campgrounds
app.get("/campgrounds", function(req, res) {
    //get all campgrounds from the DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds:allCampgrounds}); //the first 'campground is the name, the second one is the data being passed.'
        }
    });
    
});

//CREATE Route - add new campgrounds to DB
app.post("/campgrounds", function(req, res){
    //get data from from and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description:desc}; //create a new object containing the campgrounds.
    //Create a new camprground and save to DB
    Campground.create(newCampground, function(err, newlCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to the campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW Route - show form to create new campgrounds
//NOTE: make sure to render the 'NEW' route before the 'SHOW' route
app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
});

//SHOW Route - show more info about one campground
app.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err)
        } else{
            //render show template with the campground
            res.render("show", {campground: foundCampground});
        }
    });
});

//listen for the server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has started!!!");
});