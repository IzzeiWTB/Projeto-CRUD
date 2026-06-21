const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/carController');
const { authenticate } = require('../middlewares/auth');
const { validateCar, handleValidationErrors } = require('../middlewares/validation');

// All routes require authentication
router.use(authenticate);

/**
 * @openapi
 * tags:
 *   - name: Cars
 *     description: Car management endpoints
 */

/**
 * @openapi
 * /api/cars:
 *   get:
 *     tags: [Cars]
 *     summary: Get all cars
 *     description: Returns a list of all cars
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   model:
 *                     type: string
 *                   year:
 *                     type: integer
 *                   color:
 *                     type: string
 *                   price:
 *                     type: number
 *       401:
 *         description: Unauthorized
 */
router.get('/', getAll);

/**
 * @openapi
 * /api/cars/{id}:
 *   get:
 *     tags: [Cars]
 *     summary: Get car by ID
 *     description: Returns a single car by its MongoDB ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Car found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Car not found
 */
router.get('/:id', getById);

/**
 * @openapi
 * /api/cars:
 *   post:
 *     tags: [Cars]
 *     summary: Create a new car
 *     description: Creates a new car entry
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brand
 *               - model
 *               - year
 *               - color
 *               - price
 *             properties:
 *               brand:
 *                 type: string
 *                 example: Toyota
 *               model:
 *                 type: string
 *                 example: Corolla
 *               year:
 *                 type: integer
 *                 example: 2024
 *               color:
 *                 type: string
 *                 example: Silver
 *               price:
 *                 type: number
 *                 example: 35000
 *     responses:
 *       201:
 *         description: Car created
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
router.post('/', validateCar, handleValidationErrors, create);

/**
 * @openapi
 * /api/cars/{id}:
 *   put:
 *     tags: [Cars]
 *     summary: Update a car
 *     description: Updates an existing car
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               color:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Car updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Car not found
 *       422:
 *         description: Validation error
 */
router.put('/:id', validateCar, handleValidationErrors, update);

/**
 * @openapi
 * /api/cars/{id}:
 *   delete:
 *     tags: [Cars]
 *     summary: Delete a car
 *     description: Deletes a car
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Car deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Car not found
 */
router.delete('/:id', remove);

module.exports = router;
