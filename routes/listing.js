const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage, cloudinary} = require("../cloudConfig.js");
const upload = multer({storage});


// get form for creating new listing
router.get("/new", isLoggedIn, listingController.show1);


// yahan neechy jo 3  routes hain jin me /:id aa raha hai in jo neechy e likhna hoga ga hamesha q k agar isko /new k ooper likha to ye route new ko as a argument lyly ga lekin hamain req.params sy id ko as a argument lena hai isliye isko neechy likha
// get update (edit) listing route
router.get("/:id/update", isLoggedIn, isOwner, wrapAsync(listingController.renderEdit));

// Delete Listing
router.delete("/:id/delete", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// show route (individual listing)
router.route("/:id")
    .get(wrapAsync(listingController.show))
    .put(isLoggedIn, 
        isOwner, 
        upload.single('image'),
        validateListing, 
        wrapAsync(listingController.putEdited));

// index route (list of all listings) and post new listing
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,  
    upload.single('image'),
    validateListing, wrapAsync(listingController.postNewListing));

module.exports = router;