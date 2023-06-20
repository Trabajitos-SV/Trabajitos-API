const { body, param } = require("express-validator");
const validators = {};


validators.createPortfolioValidator = [
    body("description")
        .notEmpty()
        .withMessage("The description can not be empty")
        .isLength({ max: 280 }).withMessage(" The description can not overpass the limit"),
    body("title")
        .notEmpty()
        .withMessage("The title can not be empty"),
    body("category")
        .notEmpty()
        .withMessage("The category id can not be empty")
        .isMongoId()
        .withMessage("The category id must be from mongo")

];

validators.findByIdValidator = [
    param("identifier")
        .notEmpty().withMessage("El id no debe ir vacio")
        .isMongoId().withMessage("The id must be from mongo")
];

module.exports = validators;