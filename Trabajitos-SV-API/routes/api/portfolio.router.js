const express = require("express");
const router = express.Router();

const ROLES = require("../../data/roles.constants.json");

const portfolioController = require("../../controllers/portfolio.controller");
const portfolioValidator = require("../../validators/portfolio.validator");
const runValidations = require("../../validators/index.middleware");

const {
    authentication,
    authorization
} = require("../../middlewares/auth.middlewares");

router.get("/",
    portfolioController.findAll);

router.get("/byCategory/:identifier",
    authentication,
    portfolioController.findPortfolioByCategory);

router.get("/myPortfolio", 
    authentication,
    portfolioController.findMyPortfolio);

router.get("/findById/:identifier",
    authentication,
    portfolioController.findPortfolioById);

router.post("/",
    authentication,
    authorization(ROLES.USER),
    portfolioValidator.createPortfolioValidator,
    runValidations,
    portfolioController.create);

router.patch("/updateMyPortfolio/:identifier",
    authentication,
    authorization(ROLES.USER),
    portfolioController.updatePortfolio);

router.patch("/reviews",
    authentication,
    authorization(ROLES.USER),
    portfolioController.createReview);

module.exports = router;