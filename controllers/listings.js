const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    //      let result = listingSchema.validate(req.body);
    //    console.log(result);
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "New Listing Created !");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    try {
      const listingId = req.params.id;
      const listing = await Listing.findById(listingId)
        .populate({
           path: "reviews",
           populate: {
             path: "author" 
            },
          })
        .populate("owner"); // Fetch the listing from the database
  
      if (!listing) {
        // return res.status(404).send("Listing not found");
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
      }
      console.log(listing);
  
      res.render("listings/show.ejs", { listing }); // Pass the listing object to the view
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
};


module.exports.updateListing = async (req, res) => {
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
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      // return res.status(404).send("Listing not found");
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};
