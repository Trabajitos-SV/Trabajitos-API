const express = require("express");
const router = express.Router();

const ROLES = require("../../data/roles.constants.json");

const authController = require("../../controllers/auth.controller");
const runValidations = require("../../validators/index.middleware");
const validators = require("../../validators/auth.validator");
const { authentication, authorization } = require("../../middlewares/auth.middlewares");

/**
 * @swagger
 * components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - phone
 *          - password
 *          - email
 *        properties:
 *          _id:
 *              type: ObjectId
 *              description: The auto-generated id of a user
 *          name:
 *              type: string
 *              description: First and last name of user
 *          phone:
 *              type: string
 *              description: Phone number that belongs to the user
 *          password:
 *              type: string
 *              description: Encrypted password that allows a user to start a session
 *          email:
 *              type: string
 *              description: Email address that allows a user to start a session
 *          image:
 *              type: string
 *              description: Location where the profile picture is stored
 *          municipality: 
 *              type: ObjectId
 *              description: Id that identifies the municipality where the user is from
 */

/**
 * @swagger
 * tags:
 *  name: User
 *  description: This section contains all the requests related to User
 */

/**
 * @swagger
 * /api/auth/signup:
 *    post:
 *      summary: Register a user
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                          phone:
 *                              type: string
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          201:
 *            description: User was successfully created!
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                             type: string
 *                             example: "User was successfully created!"
 *          409:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "The user in question already exists"
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
router.post("/signup",
    validators.registerValidator,
    runValidations,
    authController.register);

/**
 * @swagger
 * /api/auth/signin:
 *    post:
 *      summary: Start a session
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          identifier:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          200:
 *            description: Login was successful!
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          token:
 *                             type: string
 *                             example: "Here goes an encrypted token"
 *          401:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Invalid password!"
 *          404:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "The user requested doesn't exist"
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
router.post("/signin",
    authController.login);

/**
 * @swagger
 * /api/auth/forgotPassword:
 *    post:
 *      summary: Let's user ask for a reset password email
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *      responses:
 *          200:
 *            description: Email was successfully sent!
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          msg:
 *                             type: string
 *                             example: "Email successfully sent, please check your email inbox"
 *          404:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Cannot find a user with the given email"
 *          500:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Unexpected error while sending reset password email"
 */
router.post("/forgotPassword",
    validators.forgotPasswordValidator,
    runValidations,
    authController.forgotPassword);

/**
 * @swagger
 * /api/auth/verifyCode/{code}:
 *    get:
 *      summary: Verifies that code given by user is valid
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: code
 *            schema:
 *               type: string
 *            required: true
 *            description: Code sent to user to verify ownership of account
 *      responses:
 *          200:
 *            description: User is the rightful owner of the account!
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          userId:
 *                             type: string
 *                             example: "Here goes the id of the user"
 *          404:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "Invalid or expired token!"
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
router.get("/verifyCode/:code",
    validators.resetCodeValidator,
    runValidations,
    authController.verifyCode);

/**
 * @swagger
 * /api/auth/resetPassword:
 *    patch:
 *      summary: Change a user's password after verification
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          identifier:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          200:
 *            description: Portfolio was successfully updated!
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                             type: string
 *                             example: "Information was updated!"
 *          409:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "User not found!"
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
router.patch("/resetPassword",
    validators.findByIdValidator,
    runValidations,
    authController.passwordReset);

router.get("/whoami",
    authentication,
    authController.whoamI);

/**
 * @swagger
 * /api/auth:
 *    get:
 *      summary: Request lists all users registered
 *      tags: [User]
 *      security:
 *         - bearerAuth: []
 *      responses:
 *          200:
 *            description: List of all users
 *            content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/User'
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
router.get("/",
    authentication,
    authorization(ROLES.ADMIN),
    authController.findAll);

/**
 * @swagger
 * /api/auth/update:
 *    patch:
 *      summary: Change a user personal information
 *      tags: [User]
 *      security:
 *         - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                          phone:
 *                              type: string
 *                          email:
 *                              type: string
 *                          municipality:
 *                              type: ObjectId
 *      responses:
 *          200:
 *            description: User was successfully updated!
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                             type: string
 *                             example: "User successfully updated."
 *          409:
 *            description: Error message
 *            content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                             type: string
 *                             example: "User cannot be updated."
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
router.patch("/update",
    authentication,
    authorization(ROLES.USER),
    authController.updateUser);

module.exports = router;