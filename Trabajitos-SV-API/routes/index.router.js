var express = require('express');
var router = express.Router();

/*Importing routers*/
const authRouter = require("./api/auth.router");
const trabajitoRouter = require("./api/trabajitos.router");
const municipalityRouter = require("./api/municipality.router");
const statusRouter = require("./api/status.router");
const categoryRouter = require("./api/category.router");
const portfolioRouter = require("./api/portfolio.router");


router.use("/auth", authRouter);
router.use("/trabajito", trabajitoRouter);
router.use("/municipality", municipalityRouter);
router.use("/status", statusRouter);
router.use("/category", categoryRouter);
router.use("/portfolio", portfolioRouter);

module.exports = router;
