var mongoose = require("mongoose");

//SCHEMA SETUP
var CampgroundSchema = new mongoose.Schema({
    author : {
        id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"            
        },
        username: String

    },
    name : String,
    price: String,
    image: String,
    location: String,
    lat: Number,
    lng: Number,
    description :String,
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Campground", CampgroundSchema);