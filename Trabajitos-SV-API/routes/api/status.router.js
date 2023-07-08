const express = require("express");
const router = express.Router();

const statusController =  require("../../controllers/status.controller");
const ROLES = require("../../data/roles.constants.json");
const { authentication, authorization } = require("../../middlewares/auth.middlewares");

router.get("/",
    authentication,
    statusController.findAll);

router.post("/",
    authentication,
    authorization(ROLES.ADMIN),
    statusController.createStatus);

module.exports = router;