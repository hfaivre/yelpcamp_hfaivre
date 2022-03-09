require('dotenv').config();
var datadogRum = require('@datadog/browser-rum');

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
//var seedDB = require("./seeds");
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");

//adding random comment to push build
//Requiring routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
    
datadogRum.init({
    applicationId: '211e5e64-e8d4-41c1-9413-02cf636fff57',
    clientToken: 'pub808a4a2bd004508c689c99c351e5f7cc',
    site: 'datadoghq.com',
    service:'yelpcamp',
    // Specify a version number to identify the deployed version of your application in Datadog 
    // version: '1.0.0',
    sampleRate: 100,
    trackInteractions: true,
    defaultPrivacyLevel: 'mask-user-input'
});
    
datadogRum.startSessionReplayRecording();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//MONDODB CONFIGURATION
mongoose.connect(process.env.DATABASEURL);
//seedDB();

//SESSION CONFIGURATION
app.use(require("express-session")({
    secret: "Rusty is the best dogs ever",
    resave: false,
    saveUninitialized: false
}));

//FLASH CONFIGURATION
app.use(flash());


//PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//GLOBAL VARIABLES
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// ROUTE CONFIGURATION
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds",campgroundRoutes);




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelcamp server has started...");
});
