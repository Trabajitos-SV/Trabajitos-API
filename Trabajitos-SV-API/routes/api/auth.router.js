const express = require("express");
const router = express.Router();

const authController = require("../../controllers/auth.controller");
const runValidations = require("../../validators/index.middleware");
const validators = require("../../validators/auth.validator");
const { authentication } = require("../../middlewares/auth.middlewares");

router.post("/signup",
    validators.registerValidator,
    runValidations,
    authController.register);

router.post("/signin",
    authController.login);

router.post("/forgotPassword",
    validators.forgotPasswordValidator,
    runValidations,
    authController.forgotPassword);

router.get("/verifyCode/:code",
    validators.resetCodeValidator,
    runValidations,
    authController.verifyCode);

router.patch("/resetPassword",
    validators.findByIdValidator,
    runValidations,
    authController.passwordReset);

router.get("whoami",
    authentication,
    authController.whoamI);

router.get("/",
    authController.findAll);


module.exports = router;