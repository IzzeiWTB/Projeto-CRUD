const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/clothingBrandController');
const { authenticate } = require('../middlewares/auth');
const { validateClothingBrand, handleValidationErrors } = require('../middlewares/validation');

// All routes require authentication
router.use(authenticate);

/**
 * @openapi
 * tags:
 *   - name: Clothing Brands
 *     description: Clothing brand management endpoints
 */

/**
 * @openapi
 * /api/clothing-brands:
 *   get:
 *     tags: [Clothing Brands]
 *     summary: Get all clothing brands
 *     description: Returns a list of all clothing brands
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of clothing brands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   country:
 *                     type: string
 *                   foundedYear:
 *                     type: integer
 *                   segment:
 *                     type: string
 *                   website:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/', getAll);

/**
 * @openapi
 * /api/clothing-brands/{id}:
 *   get:
 *     tags: [Clothing Brands]
 *     summary: Get clothing brand by ID
 *     description: Returns a single clothing brand by its MongoDB ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Clothing Brand MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Clothing brand found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Clothing brand not found
 */
router.get('/:id', getById);

/**
 * @openapi
 * /api/clothing-brands:
 *   post:
 *     tags: [Clothing Brands]
 *     summary: Create a new clothing brand
 *     description: Creates a new clothing brand entry
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - country
 *               - foundedYear
 *               - segment
 *             properties:
 *               name:
 *                 type: string
 *                 example: Gucci
 *               country:
 *                 type: string
 *                 example: Italy
 *               foundedYear:
 *                 type: integer
 *                 example: 1921
 *               segment:
 *                 type: string
 *                 enum: [Luxo, Casual, Esportivo, Streetwear, Fast Fashion]
 *                 example: Luxo
 *               website:
 *                 type: string
 *                 example: https://www.gucci.com
 *     responses:
 *       201:
 *         description: Clothing brand created
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Brand name already exists
 *       422:
 *         description: Validation error
 */
router.post('/', validateClothingBrand, handleValidationErrors, create);

/**
 * @openapi
 * /api/clothing-brands/{id}:
 *   put:
 *     tags: [Clothing Brands]
 *     summary: Update a clothing brand
 *     description: Updates an existing clothing brand
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
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *               foundedYear:
 *                 type: integer
 *               segment:
 *                 type: string
 *                 enum: [Luxo, Casual, Esportivo, Streetwear, Fast Fashion]
 *               website:
 *                 type: string
 *     responses:
 *       200:
 *         description: Clothing brand updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Clothing brand not found
 *       409:
 *         description: Brand name already exists
 *       422:
 *         description: Validation error
 */
router.put('/:id', validateClothingBrand, handleValidationErrors, update);

/**
 * @openapi
 * /api/clothing-brands/{id}:
 *   delete:
 *     tags: [Clothing Brands]
 *     summary: Delete a clothing brand
 *     description: Deletes a clothing brand
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
 *         description: Clothing brand deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Clothing brand not found
 */
router.delete('/:id', remove);

module.exports = router;
