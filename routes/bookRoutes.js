const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getBook, setBook, updateBook, deleteBook } = require('../controllers/booksController');

router.get('/', protect, getBook);
router.post('/', protect, setBook);
router.put('/:id', protect, updateBook);
router.delete('/:id', protect, deleteBook);

module.exports = router;
