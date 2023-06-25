const express = require("express");
const router = express.Router();

const statusController =  require("../../controllers/status.controller");

router.post("/",
    statusController.createStatus);

module.exports = router;