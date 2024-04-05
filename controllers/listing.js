// ye ooper wala code jo comment out hua hai ye mene khud likha hai or neechy chat gpt sy isi ko thora or better krwa k paste kiya hai lekin working dono ki same hai bas usme thori positions uper neechy hui hain


// const Listing  = require("../models/Listing.js");


// // index
// module.exports.index = async ( req, res )=>{
//     let allListings = await Listing.find({});
//     res.render("listings/index.ejs", {allListings});
// };


// // get route for create new listing
// module.exports.show1 = (req, res)=>{
//     res.render( "listings/new.ejs" );
// };

// // post route for listing
// module.exports.show = async(req, res)=>{
//     let {id} = req.params;
//     let listing = await Listing.findById(id).populate({
//         path: "reviews",
//         populate: {
//             path: "author",
//         }
//     }).populate("owner");
//     if(!listing){
//         req.flash("error","No Listing with that ID");
//         res.redirect("/listings")
//     }
//     res.render("listings/show.ejs", {listing});
// };


// // post new listing
// module.exports.postNewListing = async(req, res, next)=>{   
//     let {title, description, price, image, location, country} = req.body;
//     let newListing = new Listing({
//     title: title, 
//     description:description,  
//     price:price, 
//     image:image,
//     location:location,
//     country:country
// });
// let owner = req.user._id;
// newListing.owner=owner;
// await newListing.save();
// req.flash("success","Successfully added a new listing!");
// res.redirect('/listings'); 
// };


// // get edit listing route
// module.exports.renderEdit = async (req,res)=> {
//     const id= req.params.id;
//     const listing = await Listing.findById(id);
//     if(!listing){
//         req.flash("error","The Listing you are trying to find does not exist!");
//         res.redirect("/listings")
//     }
//     res.render("listings/update.ejs", {listing});
//     };


// // update edited listing by put method
// module.exports.putEdited = async(req, res)=>{
//         let id = req.params.id;
//         const {title, description, price, image, location, country} = req.body;
//         await Listing.findByIdAndUpdate(id , {
//         title: title, 
//         description:description,  
//         price:price, 
//         image:image,
//         location:location,
//         country:country
//         },
//         {new: true});
//         req.flash("success","Successfully updated a listing!");
//         res.redirect("/listings");
// };


// // delete listing
// module.exports.deleteListing = async(req, res)=>{
//     let id = req.params.id;
//     await Listing.findByIdAndDelete(id);    
//     req.flash("success","Successfully deleted a listing!");
//     res.redirect("/listings");
// };


const Listing = require("../models/Listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken });


// Index - Get all listings
module.exports.index = async (req, res) => {
    // Retrieve all listings from the database
    let allListings = await Listing.find({});
    // Render the index page with the retrieved listings
    res.render("listings/index.ejs", { allListings });
};

// Show1 - Render form for creating a new listing
module.exports.show1 = (req, res) => {
    // Render the new listing form
    res.render("listings/new.ejs");
};

// Show - Get a specific listing by ID
module.exports.show = async (req, res) => {
    // Extract the ID from the request parameters
    let { id } = req.params;
    // Find the listing by ID and populate associated reviews and owner
    let listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner");
    // If listing is not found, redirect to index page with an error message
    if (!listing) {
        req.flash("error", "No Listing with that ID");
        return res.redirect("/listings");
    }
    // Render the show page with the retrieved listing
    res.render("listings/show.ejs", { listing });
};

// PostNewListing - Create a new listing
module.exports.postNewListing = async (req, res, next) => {
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.location,
        limit: 1
    })
    .send();

    let geometry = response.body.features[0].geometry;


    let url = req.file.path;
    let filename = req.file.filename;
    // Extract listing details from request body
    let { title, description, price, image, location, country } = req.body;
    // Create a new listing object
    let newListing = new Listing({
        title: title,
        description: description,
        price: price,
        image: {
            url: url,
            filename: filename
        },
        location: location,
        country: country,
        geometry: geometry
    });
    // Set the owner of the new listing to the current user
    let owner = req.user._id;
    newListing.owner = owner;
    // Save the new listing to the database
    let newlisting = await newListing.save();
    console.log(newlisting)
    // Flash success message and redirect to index page
    req.flash("success", "Successfully added a new listing!");
    res.redirect('/listings');
};

// RenderEdit - Render form for editing a listing
module.exports.renderEdit = async (req, res) => {
    // Extract the ID from the request parameters
    const id = req.params.id;
    // Find the listing by ID
    const listing = await Listing.findById(id);
    // If listing is not found, redirect to index page with an error message
    if (!listing) {
        req.flash("error", "The Listing you are trying to find does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    let newImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    // Render the edit page with the retrieved listing
    res.render("listings/update.ejs", { listing, newImageUrl });
};

// PutEdited - Update an existing listing
module.exports.putEdited = async (req, res) => {
   

    // Extract the ID from the request parameters and listing details from request body
    let id = req.params.id;
    const { title, description, price, image, location, country } = req.body;
    // Update the listing by ID with the new details
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        await Listing.findByIdAndUpdate(id, {
            title: title,
            description: description,
            price: price,
            image: {
                    url: url,
                    filename: filename
                },
            location: location,
            country: country
        },
            { new: true });
    }else{
        await Listing.findByIdAndUpdate(id, {
            title: title,
            description: description,
            price: price,
            location: location,
            country: country
        },
            { new: true });
    }

    // Flash success message and redirect to index page
    req.flash("success", "Successfully updated a listing!");
    res.redirect("/listings");
};

// DeleteListing - Delete a listing
module.exports.deleteListing = async (req, res) => {
    // Extract the ID from the request parameters
    let id = req.params.id;
    // Find and delete the listing by ID
    await Listing.findByIdAndDelete(id);
    // Flash success message and redirect to index page
    req.flash("success", "Successfully deleted a listing!");
    res.redirect("/listings");
};
