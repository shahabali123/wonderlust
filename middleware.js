const Listing  = require("./models/Listing.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require( "./models/review.js");

// schema validation middleware using joi
module.exports.validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let  msg = error.details.map((det)=> det.message).join(", ");
    throw new  ExpressError(400, msg) ;
    } else {
        next();
    }
};


// reviews validation using joi
module.exports.validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        let  msg = error.details.map((det)=> det.message).join(", ");
    throw new  ExpressError(400, msg) ;
    } else {
        next();
    }
};


// middleware for checking if the user was logged in
module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;  // Store the original URL to redirect after login in session
        req.flash("error", "You must be logged in to perform changes.");
        return res.redirect("/login");
    }
    next();
};

// redirect URL  when not logged in on the same page from where the user comes from
module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// middleware for checking if the user was editing or deleting the listing he is the owner of the listing or not
module.exports.isOwner = async (req, res, next)=>{
    let id = req.params.id;
let listing = await Listing.findById(id);
if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash('error', 'You do not have permission to edit or delete this listing!');
    return res.redirect(`/listings/${id}`)
}
next();
};

// ye middleware check kry ga k jo user review ko delete kr raha hai kya woi us review ka author hai agar hai to delete ho jaye ga agar nhi to nhi
module.exports.isReviewAuthor = async (req, res, next) => {
    let { reviewId, id } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You cannot delete this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
