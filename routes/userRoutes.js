const express = require('express');
const router = express.Router();
const {
	registerUser,
	loginUser,
	getCurrentUser,
	updateUser,
	unregisterUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/currentUser', protect, getCurrentUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, unregisterUser);

module.exports = router;
