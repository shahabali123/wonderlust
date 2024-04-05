const Listing  = require("../models/listing.js");
const Review = require("../models/review.js");


// all reviews
module.exports.allReviews = async(req, res)=>{
    let newReview = new Review(req.body.review);
    let listing = await  Listing.findById(req.params.id);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Successfully Added new review!");
    res.redirect(`/listings/${listing._id}`)
};


// delete reviews
module.exports.deleteReview =async(req, res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Successfully deleted a review!");

    res.redirect(`/listings/${id}`);;
};