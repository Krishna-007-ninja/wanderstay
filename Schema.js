const Joi = require("joi");

module.exports.listingSchema = Joi.object( {
    listing: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required(),
        location: Joi.string().required(),
        category: Joi.string().valid(
        "Trending", "Room", "Iconic Cities", "Mountain", "Castles",
        "Arctic", "Camping", "Farms", "Domes", "Boats", "Hospitality"
        ).required(),
        country: Joi.string().required(),
        image: Joi.string().allow("", null)
    }).required()
});

module.exports.reviewShema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
})