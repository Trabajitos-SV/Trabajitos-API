const { body } = require ("express-validator");

const validators = {};

const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,32})/


validators.registerValidator = [
    body('name') 
        .notEmpty().withMessage('Name can not be empty'),
    body('phone')
        .notEmpty().withMessage("Phone number can not be empty")
        .isMobilePhone().withMessage("You must be add a valid phone number"),
    body("email")
        .notEmpty().withMessage("Email can not be empty")
        .isEmail().withMessage("Must verify the email format"),
    body("password")
        .notEmpty().withMessage("Passqord can not be empty")
        .matches(passwordRegexp).withMessage("Password must have between 8 and 32 chars, and at least 1 M, 1 m y 1 #")
]


module.exports = validators;