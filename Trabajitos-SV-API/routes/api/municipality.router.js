const express = require("express");
const router = express.Router();

const municipalityController = require("../../controllers/municipality.controller");
const ROLES = require("../../data/roles.constants.json");
const { authentication, authorization } = require("../../middlewares/auth.middlewares");

router.get("/",
    authentication,
    municipalityController.findAll);

router.post("/",
    authentication,
    authorization(ROLES.ADMIN),
    municipalityController.createMunicipality);

module.exports = router;