const express = require("express");
const router = express.Router();

const categoryController = require("../../controllers/category.controller");
const ROLES = require("../../data/roles.constants.json");
const { authentication, authorization } = require("../../middlewares/auth.middlewares");

router.post("/",
    authentication,
    authorization(ROLES.ADMIN),
    categoryController.createCategory);

router.get("/",
    authentication,
    categoryController.findAllCategories);

module.exports = router;