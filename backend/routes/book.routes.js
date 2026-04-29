const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book.controller');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharpMiddleware = require('../middleware/sharp-config');







// GET /api/books
router.get('/', bookCtrl.getAllBooks);

// GET /api/books/bestrating
router.get('/bestrating', bookCtrl.getBestRatedBooks);

// GET /api/books/:id
router.get('/:id', bookCtrl.getOneBook);

// POST /api/books
router.post('/', auth, multer, sharpMiddleware, bookCtrl.createBook);

// PUT /api/books/:id
router.put('/:id', auth, multer, sharpMiddleware, bookCtrl.updateBook);

// DELETE /api/books/:id
router.delete('/:id', auth, bookCtrl.deleteBook);

// POST /api/books/:id/rating
router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;

