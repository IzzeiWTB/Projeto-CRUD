const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/motorcycleController');
const { authenticate } = require('../middlewares/auth');
const { validateMotorcycle, handleValidationErrors } = require('../middlewares/validation');

// All routes require authentication
router.use(authenticate);

/**
 * @openapi
 * tags:
 *   - name: Motorcycles
 *     description: Motorcycle management endpoints
 */

/**
 * @openapi
 * /api/motorcycles:
 *   get:
 *     tags: [Motorcycles]
 *     summary: Get all motorcycles
 *     description: Returns a list of all motorcycles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of motorcycles
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
 *                   engineCapacity:
 *                     type: integer
 *                   price:
 *                     type: number
 *       401:
 *         description: Unauthorized
 */
router.get('/', getAll);

/**
 * @openapi
 * /api/motorcycles/{id}:
 *   get:
 *     tags: [Motorcycles]
 *     summary: Get motorcycle by ID
 *     description: Returns a single motorcycle by its MongoDB ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Motorcycle MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Motorcycle found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Motorcycle not found
 */
router.get('/:id', getById);

/**
 * @openapi
 * /api/motorcycles:
 *   post:
 *     tags: [Motorcycles]
 *     summary: Create a new motorcycle
 *     description: Creates a new motorcycle entry
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
 *               - engineCapacity
 *               - price
 *             properties:
 *               brand:
 *                 type: string
 *                 example: Honda
 *               model:
 *                 type: string
 *                 example: CB 500F
 *               year:
 *                 type: integer
 *                 example: 2024
 *               engineCapacity:
 *                 type: integer
 *                 example: 500
 *               price:
 *                 type: number
 *                 example: 28000
 *     responses:
 *       201:
 *         description: Motorcycle created
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
router.post('/', validateMotorcycle, handleValidationErrors, create);

/**
 * @openapi
 * /api/motorcycles/{id}:
 *   put:
 *     tags: [Motorcycles]
 *     summary: Update a motorcycle
 *     description: Updates an existing motorcycle
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
 *               engineCapacity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Motorcycle updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Motorcycle not found
 *       422:
 *         description: Validation error
 */
router.put('/:id', validateMotorcycle, handleValidationErrors, update);

/**
 * @openapi
 * /api/motorcycles/{id}:
 *   delete:
 *     tags: [Motorcycles]
 *     summary: Delete a motorcycle
 *     description: Deletes a motorcycle
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
 *         description: Motorcycle deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Motorcycle not found
 */
router.delete('/:id', remove);

module.exports = router;
