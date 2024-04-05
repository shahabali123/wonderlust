const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review =  require("./review.js");
const { string } = require("joi");



const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});


// ye middleware define kiyta hai ta k jab b listing delete ho usky sath usky associated reviews b delete ho jayen
listingSchema.post("findOneAndDelete", async function(listing) {
  if(listing){
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
// __________________________________________________

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;