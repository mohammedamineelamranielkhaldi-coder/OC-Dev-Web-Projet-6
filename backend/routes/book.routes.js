const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book.controller');

// GET /api/books
router.get('/', bookCtrl.getAllBooks);

// GET /api/books/:id
router.get('/:id', bookCtrl.getOneBook);

// POST /api/books
router.post('/', bookCtrl.createBook);

// PUT /api/books/:id
router.put('/:id', bookCtrl.updateBook);

// DELETE /api/books/:id
router.delete('/:id', bookCtrl.deleteBook);

// POST /api/books/:id/rating
router.post('/:id/rating', bookCtrl.rateBook);

module.exports = router;

