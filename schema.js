const Joi = require( "joi" );

module.exports.listingSchema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().positive().required(),
        image: Joi.string(),
        country: Joi.string().required(),
});


module.exports.reviewSchema = Joi.object({
        review: Joi.object({
                rating: Joi.number().integer().min(0).max(5).required(),
                comment: Joi.string().required()
        }).required()      
});