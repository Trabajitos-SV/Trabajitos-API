const { body, param } = require("express-validator");
const validators = {};

validators.createTrabajitoValidator = [
    body("description")
        .notEmpty()
        .withMessage("The description field can not be empty.")
        .isLength({ max: 280 }).withMessage(" The description can not overpass the limit."),
    body("dateInit")
        .notEmpty()
        .withMessage("The init date field can not be empty."),
    body("id_hired")
        .notEmpty()
        .withMessage("The hired person id field can not be empty.")
        .isMongoId()
        .withMessage("The hired person id must have MongoDB format.")
];

validators.findByIdValidator = [
    param("identifier")
        .notEmpty().withMessage("The id field can not be empty.")
        .isMongoId().withMessage("The id must have MongoDB format.")
];



module.exports = validators;