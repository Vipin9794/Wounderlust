const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

//index route,
router.route("/").get(listingController.index)
//.post(
  //Create route
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListing)
// );
.post(upload.single('listing[image]'), (req, res) => {
  
  res.send("Working");
});



//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) //Show Route
  .put(
    //update route
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    //Delete route
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
