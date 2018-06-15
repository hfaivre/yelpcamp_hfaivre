var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var Campground = require("../models/campground");

//===================================
//        AUTHENTICATION ROUTES
//===================================

//Root route
router.get("/", function(req, res){
    res.render("landing");
});

//Show register form
router.get("/register", function(req,res){
    res.render("register", {page: 'register'});
});

//Handle signup logic
router.post("/register", function(req,res){
    var newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    });
    User.register(newUser,req.body.password, function(err,user){
      if(err){
        console.log(err);
        return res.render("register", { error :err.message});
      }else{
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
      }
    });
    
});


//Show login form
router.get("/login", function(req, res){
    res.render("login", {page: 'login'});
});

//Handle login logic
router.post("/login", function (req, res, next) {
  passport.authenticate("local",
    {
      successRedirect: "/campgrounds",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: "Welcome to YelpCamp, " + req.body.username + "!"
    })(req, res);
});

//Logout logic
router.get("/logout", function(req,res){
    req.logout();
    //req.flash("success", "You are now logged out!");
    res.redirect("/");
});


//User profile
router.get("/users/:id", function(req, res){
  User.findById(req.params.id, function(err,foundUser){
    if(err){
      req.flash("error","Oops! Something went wrong...");
      res.redirect("/campgrounds");
    }else{
      Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
        if(err){
          req.flash("error","Oops! Something went wrong...");
          res.redirect("/campgrounds");          
        }
        res.render("users/show", {user:foundUser, campgrounds: campgrounds});
      });

    }
  });
});

module.exports = router;