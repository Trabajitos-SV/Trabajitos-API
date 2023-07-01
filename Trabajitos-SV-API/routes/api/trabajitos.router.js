const express = require("express");
const router =  express.Router();

const ROLES = require("../../data/roles.constants.json");

const trabajitoController = require("../../controllers/trabajito.controller");
const trabajitoValidator = require("../../validators/trabajito.validators");
const runValidations = require("../../validators/index.middleware");

const { authentication, authorization } = require("../../middlewares/auth.middlewares");

/**
 * @swagger
 * components:
 *    schemas:
 *      Trabajito:
 *        type: object
 *        required:
 *          - description
 *          - dateInit
 *          - id_solicitor
 *          - id_hired
 *          - status
 *        properties:
 *          _id:
 *              type: ObjectId
 *              description: The auto-generated id of portfolio
 *          description:
 *              type: string
 *              description: A description of the job the person who asks for a job needs completed
 *          dateInit:
 *              type: date
 *              description: Date when the job will start
 *          dateFinish:
 *              type: date
 *              description: Date when the job will finish
 *          endNumber:
 *              type: string
 *              description: Confirmation number needed to finish a job
 *          id_solicitor: 
 *              type: ObjectId
 *              description: Id of the user that requests a job
 *          id_hired: 
 *              type: ObjectId
 *              description: Id of the user that performs a job
 *          status:
 *              type: ObjectId
 *              description: Id of the current status of a job
 */

/**
 * @swagger
 * tags:
 *  name: Trabajito
 *  description: This section contains all the requests related to Trabajitos
 */

/**
 * @swagger
 * /api/trabajito:
 *    get:
 *      summary: Returns all the trabajitos created in the app
 *      tags: [Trabajito]
 *      responses:
 *          200:
 *            description: List of all trabajitos
 *            content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Trabajito'
 *          404:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              example: "Trabajitos not found"
 *          500:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              example: Internal server error
 */
router.get("/",
    trabajitoController.findAll);

/**
 * @swagger
 * /api/trabajito/requests:
 *    get:
 *      summary: Returns all the trabajitos requested by a specific user
 *      tags: [Trabajito]
 *      security:
 *         - bearerAuth: []
 *      responses:
 *          200:
 *            description: List of all trabajitos requested
 *            content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Trabajito'
 *          404:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              example: "Requests not found"
 *          500:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              example: Internal server error
 */
router.get("/requests",
    authentication,
    trabajitoController.findMyRequests);

/**
 * @swagger
 * /api/trabajito/requests/{identifier}:
 *    get:
 *      summary: Returns a specific trabajito requested by a specific user
 *      tags: [Trabajito]
 *      security:
 *         - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: identifier
 *            schema:
 *               type: string
 *            required: true
 *            description: The trabajito identifier goes here
 *      responses:
 *          200:
 *            description: Returns of trabajito requested
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Trabajito'
 *          404:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              example: "Trabajito not found"
 *          500:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              example: Internal server error
 */
router.get("/requests/:identifier",
    authentication,
    trabajitoValidator.findByIdValidator,
    runValidations,
    trabajitoController.findRequestById);

/**
 * @swagger
 * /api/trabajito/jobs:
 *    get:
 *      summary: Returns all the trabajitos that were requested to a user
 *      tags: [Trabajito]
 *      security:
 *         - bearerAuth: []
 *      responses:
 *          200:
 *            description: List of all trabajitos requested
 *            content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Trabajito'
 *          404:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              example: "Trabajitos not found"
 *          500:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              example: Internal server error
 */
router.get("/jobs",
    authentication,
    trabajitoController.findMyJobs);

/**
 * @swagger
 * /api/trabajito/job/{identifier}:
 *    get:
 *      summary: Returns a specific trabajito requested to a user
 *      tags: [Trabajito]
 *      security:
 *         - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: identifier
 *            schema:
 *               type: string
 *            required: true
 *            description: The portfolio identifier goes here
 *      responses:
 *          200:
 *            description: Returns of trabajito requested
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Trabajito'
 *          404:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              example: "Trabajito not found"
 *          500:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              example: Internal server error
 */
router.get("/job/:identifier",
    authentication,
    trabajitoValidator.findByIdValidator,
    runValidations,
    trabajitoController.findJobById);

/**
 * @swagger
 * /api/trabajito:
 *    post:
 *      summary: Create a new trabajito request
 *      tags: [Trabajito]
 *      security:
 *         - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          description:
 *                              type: string
 *                          dateInit:
 *                              type: date
 *                          status:
 *                              type: ObjectId
 *                          id_hired:
 *                              type: ObjectId
 *      responses:
 *          201:
 *            description: The trabajito was successfully created!
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Trabajito'
 *          409:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Unexpected error creating a job request"
 *          500:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Internal server error"
 */
router.post("/",
    authentication,
    authorization(ROLES.USER),
    trabajitoValidator.createTrabajitoValidator,
    runValidations,
    trabajitoController.createTrabajito);

/**
 * @swagger
 * /api/trabajito/start:
 *    patch:
 *      summary: Request to start a trabajito
 *      tags: [Trabajito]
 *      security:
 *         - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: ObjectId
 *                          dateFinish:
 *                              type: date
 *                          status:
 *                              type: ObjectId
 *      responses:
 *          200:
 *            description: Your Trabajito has started!
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Trabajito'
 *          409:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Unexpected error updating a job"
 *          500:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Internal server error"
 */
router.patch("/start",
    authentication,
    authorization(ROLES.USER),
    trabajitoController.startTrabajito);

/**
 * @swagger
 * /api/trabajito/finish:
 *    patch:
 *      summary: Request to finish a trabajito
 *      tags: [Trabajito]
 *      security:
 *         - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: ObjectId
 *                          endNumber:
 *                              type: number
 *      responses:
 *          200:
 *            description: The process to finish a trabajito has started
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Trabajito'
 *          404:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Trabajito not found"
 *          409:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Unexpected error updating trabajito"
 *          500:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Internal server error"
 */
router.patch("/finish",
    authentication,
    authorization(ROLES.USER),
    trabajitoController.endTrabajito);

/**
 * @swagger
 * /api/trabajito/finalization:
 *    patch:
 *      summary: Request to finish a trabajito from client's side
 *      tags: [Trabajito]
 *      security:
 *         - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: ObjectId
 *                          endNumber:
 *                              type: number
 *                          status:
 *                              type: ObjectId
 *      responses:
 *          200:
 *            description: Your trabajito was successfully completed!
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Trabajito'
 *          404:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Trabajito not found"
 *          409:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Unexpected error updating trabajito"
 *          500:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Internal server error"
 */
router.patch("/finalization",
    authentication,
    authorization(ROLES.USER),
    trabajitoController.endConfirmationTrabajito);

/**
 * @swagger
 * /api/trabajito/deletion/{identifier}:
 *    patch:
 *      summary: Request to delete a trabajito from client's side
 *      tags: [Trabajito]
 *      security:
 *         - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: identifier
 *            schema:
 *               type: string
 *            required: true
 *            description: The trabajito identifier goes here
 *      responses:
 *          200:
 *            description: Trabajito was successfully deleted
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          msg:
 *                             type: string
 *                             example: "Trabajito was successfully deleted"
 *          404:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Trabajito not found"
 *          500:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Internal server error"
 */
router.patch("/deletion/:identifier",
    authentication,
    authorization(ROLES.USER),
    trabajitoValidator.findByIdValidator,
    runValidations,
    trabajitoController.trabajitoDeletion);

module.exports = router;