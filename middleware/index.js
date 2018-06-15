var middlewareObj = {};
var Comment = require("../models/comment");
var Campground = require("../models/campground");


middlewareObj.checkCommentOwnership =  function(req, res, next){
  if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err){
                console.log(err);
                res.redirect("back");
            }else{
                //does the user own the campground
                if(foundComment.author.id.equals(req.user._id)){
                    next();   
                }else{
                    req.flash("success", "You do not have permission to do that!");
                    res.send("you are not the owner od this camp site!!");
                }
            }
        });
   }else{
       req.flash("error", "You need to be logged in to do that. Click <a href=\"login\">here</a> to Login");
       res.redirect("back");
   }  
};


middlewareObj.checkCampgroundOwnership =  function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err){
                console.log(err);
                req.flash("error", "Campground not found.");
                res.redirect("back");
            }else{
                //does the user own the campground
                if(foundCampground.author.id.equals(req.user._id)){
                    next();   
                }else{
                    req.flash("error", "You do not have permission to do that!");
                    res.send("you are not the owner od this camp site!!");
                }
            }
        });
   }else{
       req.flash("error", "You need to be logged in to do that. Click <a href=\"login\">here</a> to Login");
       res.redirect("back");
   }
};



//Middleware
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error", "Please Login First! Click <a href=\"login\">here</a> to Login");
        res.redirect("/login");
    }
};





module.exports = middlewareObj;