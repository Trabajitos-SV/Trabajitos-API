const express = require("express");
const router =  express.Router();

const ROLES = require("../../data/roles.constants.json");

const trabajitoController = require("../../controllers/trabajito.controller");
const trabajitoValidator = require("../../validators/trabajito.validators");
const runValidations = require("../../validators/index.middleware");

const { authentication, authorization } = require("../../middlewares/auth.middlewares");

router.get("/",
    trabajitoController.findAll);

router.get("/requests",
    authentication,
    trabajitoController.findMyRequests);

router.get("/requests/:identifier",
    authentication,
    trabajitoValidator.findByIdValidator,
    runValidations,
    trabajitoController.findRequestById);

router.get("/jobs",
    authentication,
    trabajitoController.findMyJobs);

router.get("/job/:identifier",
    authentication,
    trabajitoValidator.findByIdValidator,
    runValidations,
    trabajitoController.findJobById);

router.post("/",
    authentication,
    authorization(ROLES.USER),
    trabajitoValidator.createTrabajitoValidator,
    runValidations,
    trabajitoController.createTrabajito);

router.patch("/start",
    authentication,
    authorization(ROLES.USER),
    trabajitoController.startTrabajito);

router.patch("/finish",
    authentication,
    authorization(ROLES.USER),
    trabajitoController.endTrabajito);

router.patch("/finalization",
    authentication,
    authorization(ROLES.USER),
    trabajitoController.endConfirmationTrabajito);

router.patch("/deletion/:identifier",
    authentication,
    authorization(ROLES.USER),
    trabajitoValidator.findByIdValidator,
    runValidations,
    trabajitoController.trabajitoDeletion);

module.exports = router;