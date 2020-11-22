var express = require("express");
var router = express.Router({mergeParams: true});
var Hotel = require("../models/hotels");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find hotel by id
    Hotel.findById(req.params.id, function(err, hotel){
        if(err){
            req.flash("error", "Something went wrong!");
            console.log(err);
        } else {
            res.render("comments/new", {hotel: hotel});
        }
    });
});

// Comments create
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup hotel using ID
    Hotel.findById(req.params.id, function(err, hotel){
        if(err){
            req.flash("error", "Something went wrong!");
            console.log(err);
            res.redirect("/hotels");
        } else {
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                req.flash("error", "Something went wrong!");
                console.log(err);
            } else {
                //add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                //save comment
                comment.save();
                hotel.comments.push(comment);
                hotel.save();
                req.flash("success", "Comment added!");
                res.redirect('/hotels/' + hotel._id);
            }
         });
        }
    });
 });

 // COMMENT EDIT ROUTE
 router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
     Comment.findById(req.params.comment_id, function(err, foundComment){
         if(err){
            req.flash("error", "Something went wrong!");
             res.redirect("back");
         } else {
             res.render("comments/edit", {hotel_id: req.params.id, comment: foundComment});
         }
     });
     
 });

 // COMMENT UPDATE ROUTE
 router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            res.redirect("/hotels/" + req.params.id)
        }
    });
 });

 // COMMENT DESTROY ROUTE
 router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
     //findByIdAndRemove
     Comment.findByIdAndRemove(req.params.comment_id, function(err){
         if(err){
            req.flash("error", "Something went wrong!");
             res.redirect("back");
         } else {
            req.flash("success", "Comment removed!");
             res.redirect("/hotels/" + req.params.id);
         }
     });
 });



 module.exports = router;