const express = require("express");
const router = express.Router();

const municipalityController = require("../../controllers/municipality.controller");

router.post("/",
    municipalityController.createMunicipality);

module.exports = router;