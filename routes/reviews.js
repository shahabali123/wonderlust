const express = require("express");
const router = express.Router({mergeParams: true}); // yahan py merge params is liye use kiya q k is file me jahan hamain listing ya review ki id zarroorat hogi to wo hamain is k baghair nhi mily gi q k wo id app.js me parent route k pas hai or yahan sirf mergeParams sy e pass hogi
const wrapAsync = require( '../utils/wrapAsync.js' );
const Listing  = require("../models/listing.js");
const Review  = require("../models/review.js");
const {isLoggedIn, isOwner, validateReview, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")








// all reviews routes
// review route
router.post("/", 
validateReview, 
isLoggedIn,
wrapAsync(reviewController.allReviews));

// delete review route
router.delete("/:reviewId",
isLoggedIn, 
isReviewAuthor,
wrapAsync(reviewController.deleteReview));

module.exports  = router;