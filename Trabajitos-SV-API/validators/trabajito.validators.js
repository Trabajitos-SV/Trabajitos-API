const { body, param } = require("express-validator");
const validators = [];


validators.createTrabajitoValidator = [
    body("description")
        .notEmpty()
        .withMessage("The description can not be empty")
        .isLength({ max: 280 }).withMessage(" The description can not overpass the limit"),
        body("dateInit")
            .notEmpty()
            .withMessage("The init date can not be empty"),
        body("id_hired")
            .notEmpty()
            .withMessage("The hired person id can not be empty")
            .isMongoId()
            .withMessage("The hired person id muest be from mongo")
];




validators.findByIdValidator = [
    param("identifier")
        .notEmpty().withMessage("The id can not be empty")
        .isMongoId().withMessage("the id must be from mongo")
];



module.exports = validators;