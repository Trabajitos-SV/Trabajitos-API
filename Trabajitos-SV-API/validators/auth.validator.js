const { body, param } = require ("express-validator");

const validators = {};

const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,32})/

validators.registerValidator = [
    body('name') 
        .notEmpty().withMessage('Name field can not be empty.'),
    body('phone')
        .notEmpty().withMessage("Phone number field can not be empty.")
        .isMobilePhone().withMessage("You must add a valid phone number."),
    body("email")
        .notEmpty().withMessage("Email field can not be empty.")
        .isEmail().withMessage("Please verify the email format."),
    body("password")
        .notEmpty().withMessage("Password field can not be empty.")
        .matches(passwordRegexp).withMessage("Password must have between 8 and 32 chars, and at least 1 M, 1 m y 1 #.")
]

validators.forgotPasswordValidator = [
    body("email")
        .notEmpty().withMessage("Email field cannot be empty.")
        .isEmail().withMessage("Please verify email format is valid.")
]

validators.resetCodeValidator = [
    param("code")
        .notEmpty().withMessage("The parameter field cannot be empty.")
        .isLength({ max: 4 }).withMessage("The code must have 4 digits max.")
]

validators.findByIdValidator = [
    body("identifier")
        .notEmpty().withMessage("The id field cannot be empty.")
        .isMongoId().withMessage("The id must have MongoDB format.")
]

module.exports = validators;