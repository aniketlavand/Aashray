var express = require("express");
var router = express.Router();
var Hotel = require("../models/hotels");
var middleware = require("../middleware");

//INDEX - show all hotels
router.get("/", function(req, res){
    // Get all hotels from db
    Hotel.find({}, function(err, allHotels){
        if(err){
            console.log(err);
        } else {
            res.render("hotels/index", {hotels: allHotels, page: 'hotels'});
        }
    });

});



//CREATE - add new hotel to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to hotels array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username

    }
    var newHotel = {name: name, price: price, image: image, description: desc, author: author}
    // Create a new hotel and save to DB
    Hotel.create(newHotel, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to hotels page
            res.redirect("/hotels");
        }
    });
});


//NEW - show form to create new hotel
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("hotels/new");
});

//SHOW - shows more info about a hotel
router.get("/:id", function(req, res){
    //find the hotel with provided ID
    Hotel.findById(req.params.id).populate("comments").exec(function(err, foundHotel){
        if(err){
            console.log(err);
        } else {
            //render show template with that hotel
            res.render("hotels/show", {hotel: foundHotel});
            
        }
    });
    
    
});

// EDIT HOTEL ROUTE
router.get("/:id/edit", middleware.checkHotelOwnership, function(req, res){
    Hotel.findById(req.params.id, function(err, foundHotel){
        if(err){
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            res.render("hotels/edit", {hotel: foundHotel});
        }
    }); 
});


// UPDATE HOTEL ROUTE
router.put("/:id", middleware.checkHotelOwnership, function(req, res){
    //find and update the correct hotel
    Hotel.findByIdAndUpdate(req.params.id, req.body.hotel, function(err, updatedHotel){
        if(err){
            res.redirect("/hotels");
        } else {
            res.redirect("/hotels/" + req.params.id);
        }
    });
});

// DESTROY HOTEL ROUTE
router.delete("/:id", middleware.checkHotelOwnership, function(req, res){
    Hotel.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/hotels");
        } else {
            res.redirect("/hotels");
        }
    })
});




module.exports = router;