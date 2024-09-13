
//app.js 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(() => {
   console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(MONGO_URL );
    
}

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

// app.set("view engine", "ejs" );
// app.set("views" , path.join(__dirname,"views"));
// app.use(express.urlencoded({extended:true}));
// app.use(express.urlencoded({extended: true}));
// app.use(methodOverride("_method"));
// app.engine("ejs" , ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));


app.get("/" , (req , res ) => {
    res.send("Hi , i am root");
});

const validateListing = (req , res , next) => {
    

    let {error} = listingSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    } else {
        next();
    }
};
 

//index route
app.get("/listings",wrapAsync( async (req , res ) => {
   const alllistings =  await Listing.find({});
     res.render("listings/index.ejs" , {alllistings})   

}));

//New Route 
app.get("/listings/new" , (req , res) =>{
    res.render("listings/new.ejs");
});


//Show Route
app.get('/listings/:id', async (req, res) => {
    try {
        const listingId = req.params.id;
        const listing = await Listing.findById(listingId); // Fetch the listing from the database

        if (!listing) {
            return res.status(404).send('Listing not found');
        }

        res.render('listings/show.ejs', { listing }); // Pass the listing object to the view
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


// Create route
app.post("/listings" ,validateListing , wrapAsync( async (req , res , next) =>{
//      let result = listingSchema.validate(req.body);
//    console.log(result);
    const newlisting = new Listing(req.body.listing) ;
    await newlisting.save();
     res.redirect("/listings");
  
})
);

//edit route 
app.get("/listings/:id/edit",wrapAsync( async (req,res )=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
}));

//update route
app.put("/listings/:id" , validateListing, async (req , res)=>{
    let {id} = req.params;
    let formData = req.body.listing;
       let updatedListing = await Listing.findByIdAndUpdate(
      id,
      {
        ...formData,
      },
      { new: true } //ensures that updatedListing contains the updated document with all the new field values, rather than the old document before the update.
);
await updatedListing.save();
    res.redirect(`/listings/${id}`);
}); 
// app.put("/listings/:id" ,validateListing, async (req , res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id ,{...req.body.listing} );
//     res.redirect(`/listings/${id}`);
// });

//Delete route
app.delete("/listings/:id" ,wrapAsync( async (req , res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


// app.get("/testListing" , async (req , res) =>{
//      let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "By the beach",
//         price : 1200,
//         location : " Calangute , Goa",
//         country : "India",
//      });
//      await sampleListing.save();
//      console.log("sample was saved");
//      res.send("successful testing");

// });

app.all("*" , (req , res , next  ) => {
    next(new ExpressError(404 , "Page not found !"));
});

app.use((err , req , res , next) =>{
    let {statusCode= 500 , message ="Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", {message});
   // res.status(statusCode).send(message);
    
});


app.listen(8080 , () => {
    console.log("server is listeningto port : 8080");
});