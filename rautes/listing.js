const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, isvalidateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require('../cloudeConfig.js')
const upload = multer({storage})


//Nav Icon Controll
// router.get("/navListings", async (req, res) => {
//   const { category } = req.query;
//   let filter = {};

//   if (category) {
//     filter.category = category;
//   }

//   const listings = await Listing.find(filter);
//   res.render("navListings/ind", { listings, category });
// });

//Category Wise Filter Route
router.route("/category")
    .get(wrapAsync(listingController.category));


//Search Route
router.route("/search")
    .get(wrapAsync(listingController.search));



//Index Route & Create Route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), isvalidateListing,wrapAsync(listingController.createListing));


//New Route
router.get("/new", isLoggedIn, (listingController.renderNewForm));

//Show Route , Update Route & Delete Route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'),isvalidateListing, wrapAsync(listingController.updateListing))
    .delete (isLoggedIn, isOwner, wrapAsync(listingController.dleteListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;