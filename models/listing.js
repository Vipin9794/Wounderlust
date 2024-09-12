const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title:{
        type : String,
        required: true
    } ,
    description :{
        type: String ,
        required : true,
    },
    image: {
        url : String,
        filename: String,
    },

    price: Number,
    location: String,
    country:String,
});

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;