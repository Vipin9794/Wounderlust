const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
  })
);

//New Route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Create route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    //      let result = listingSchema.validate(req.body);
    //    console.log(result);
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    req.flash("success", "New Listing Created !");
    res.redirect("/listings");
  })
);

//Show Route
router.get("/:id", async (req, res) => {
  try {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId).populate("reviews"); // Fetch the listing from the database

    if (!listing) {
      // return res.status(404).send("Listing not found");
      req.flash("error" , "Listing you requested for does not exist!");
      res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing }); // Pass the listing object to the view
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//update route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let formData = req.body.listing;
    let updatedListing = await Listing.findByIdAndUpdate(
      id,
      {
        ...formData,
      },
      { new: true } //ensures that updatedListing contains the updated document with all the new field values, rather than the old document before the update.
    );
    await updatedListing.save();
    req.flash("success", " Listing Updated !");
    res.redirect(`/listings/${id}`);
  })
);
// app.put("/listings/:id" ,validateListing, async (req , res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id ,{...req.body.listing} );
//     res.redirect(`/listings/${id}`);
// });

//Delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
  })
);

//edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      // return res.status(404).send("Listing not found");
      req.flash("error" , "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

module.exports = router;
