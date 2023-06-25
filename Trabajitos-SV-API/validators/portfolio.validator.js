const { body, param } = require("express-validator");
const validators = {};

validators.createPortfolioValidator = [
    body("description")
        .notEmpty()
        .withMessage("The description field can not be empty")
        .isLength({ max: 280 }).withMessage(" The description can not overpass the limit"),
    body("title")
        .notEmpty()
        .withMessage("The title field can not be empty"),
    body("category")
        .notEmpty()
        .withMessage("The category field can not be empty")
        .isMongoId()
        .withMessage("The category id must be from mongo")

];

validators.findByIdValidator = [
    param("identifier")
        .notEmpty().withMessage("The id field cannot be empty.")
        .isMongoId().withMessage("The id must have  MongoDB format.")
];

module.exports = validators;