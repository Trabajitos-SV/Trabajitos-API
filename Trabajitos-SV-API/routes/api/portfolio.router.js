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

/**
 * @swagger
 * components:
 *    schemas:
 *      Portfolio:
 *        type: object
 *        required:
 *          - title
 *          - description
 *          - user
 *          - category
 *        properties:
 *          _id:
 *              type: ObjectId
 *              description: The auto-generated id of portfolio
 *          title:
 *              type: string
 *              description: The portfolio title
 *          description:
 *              type: string
 *              description: A brief description about the portfolio
 *          user:
 *              type: ObjectId
 *              description: The id that identifies the user who created the portfolio
 *          category:
 *              type: ObjectId
 *              description: Identifier of the category to which the portfolio belongs
 *          images: 
 *              type: array
 *              items:
 *                type: string
 *                description: Array of strings, each string contains the location of each image
 *          reviews:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  description: 
 *                      type: string
 *                      description: A brief review made by the customer about the job done
 *                  qualification: 
 *                      type: number
 *                      description: A calification between 1 and 5, 5 being the highest
 *                  id_user: 
 *                      type: ObjectId
 *                      description: Id that identifies the user who made the review
 */

/**
 * @swagger
 * tags:
 *  name: Portfolio
 *  description: This section contains all the requests related to Portfolio
 */


/**
 * @swagger
 * /api/portfolio:
 *    get:
 *      summary: Returns all the portfolios created in the app
 *      tags: [Portfolio]
 *      responses:
 *          200:
 *            description: List of all portfolios
 *            content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Portfolio'
 *          404:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: string
 *                      example: No portfolios were found
 *          500:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: string
 *                      example: Internal server error
 */
router.get("/",
    portfolioController.findAll);

/**
 * @swagger
 * /api/portfolio/byCategory/{identifier}:
 *    get:
 *      summary: Returns all portfolios that are related to a certain category
 *      tags: [Portfolio]
 *      security:
 *         - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: identifier
 *            schema:
 *               type: string
 *            required: true
 *            description: The category identifier
 *      responses:
 *          200:
 *            description: List of all portfolios related to the category chosen by the user
 *            content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Portfolio'
 *          404:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "No portfolios were found"
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
router.get("/byCategory/:identifier",
    authentication,
    portfolioController.findPortfolioByCategory);

/**
 * @swagger
 * /api/portfolio/myPortfolio:
 *    get:
 *      summary: Shows a portfolio that it's owned by the user who make the request
 *      tags: [Portfolio]
 *      security:
 *         - bearerAuth: []
 *      responses:
 *          200:
 *            description: This request allows a user to access his/her own portfolio in case one was created
 *            content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Portfolio'
 *          404:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Portfolio not found"
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
router.get("/myPortfolio", 
    authentication,
    portfolioController.findMyPortfolio);

/**
 * @swagger
 * /api/portfolio/findById/{identifier}:
 *    get:
 *      summary: Shows a specific portfolio
 *      tags: [Portfolio]
 *      security:
 *         - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: identifier
 *            schema:
 *               type: string
 *            required: true
 *            description: The portfolio identifier
 *      responses:
 *          200:
 *            description: This request allows a user to access all the information about a specific portfolio
 *            content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Portfolio'
 *          404:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Portfolio not found"
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
router.get("/findById/:identifier",
    authentication,
    portfolioController.findPortfolioById);

router.get("/topPerformers",
    authentication,
    portfolioController.getTopPortfolios);

router.get("/suggestPort",
    authentication,
    portfolioController.getRandomPortfolios);

/**
 * @swagger
 * /api/portfolio:
 *    post:
 *      summary: Create a portfolio
 *      tags: [Portfolio]
 *      security:
 *         - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                          description:
 *                              type: string
 *                          images:
 *                              type: string
 *                          category:
 *                              type: string
 *      responses:
 *          201:
 *            description: Portfolio was successfully created!
 *            content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Portfolio'
 *          409:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Unexpected error occurred, portfolio cannot be created"
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
    portfolioValidator.createPortfolioValidator,
    runValidations,
    portfolioController.create);

/**
 * @swagger
 * /api/portfolio/updateMyPortfolio/{identifier}:
 *    patch:
 *      summary: Update a portfolio
 *      tags: [Portfolio]
 *      security:
 *         - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: identifier
 *            schema:
 *               type: string
 *            required: true
 *            description: Insert the portfolio identifier
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                          description:
 *                              type: string
 *                          images:
 *                              type: string
 *                          category:
 *                              type: string
 *      responses:
 *          201:
 *            description: Portfolio was successfully updated!
 *            content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Portfolio'
 *          409:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Portfolio cannot be updated"
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
router.patch("/updateMyPortfolio/:identifier",
    authentication,
    authorization(ROLES.USER),
    portfolioController.updatePortfolio);

/**
 * @swagger
 * /api/portfolio/reviews:
 *    patch:
 *      summary: Create a review
 *      tags: [Portfolio]
 *      security:
 *         - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          review:
 *                              type: string
 *                          portfolioId:
 *                              type: string
 *                          qualification:
 *                              type: number
 *      responses:
 *          201:
 *            description: Your review was successfully added!
 *            content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Portfolio'
 *          409:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Unexpected error while creating review"
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
router.patch("/reviews",
    authentication,
    authorization(ROLES.USER),
    portfolioController.createReview);

module.exports = router;