const asyncHandler = require('express-async-handler');
const Book = require('../models/bookModel');
const User = require('../models/userModel');

// @desc    Get user's book
// @route   GET /api/book
// @access  Private
const getBook = asyncHandler(async (request, response) => {
	// find the users book by the users id
	const book = await Book.find({ user: request.user.id });
	response.status(200).json(book);
});

// @desc    Set a new Book
// @route   POST /api/book
// @access  Private
const setBook = asyncHandler(async (req, res) => {
	const { name, author, chapters } = req.body;

	if (!name || !author || !chapters) {
		res.status(400);
		throw new Error('Not all required fields are filled');
	}

	const newBook = await Book.create({
		user: req.user.id,
		name: name,
		author: author,
		chapters: chapters,
	});

	res.status(200).json(newBook);
});

// @desc    Update existing Book
// @route   PUT /api/book/:id
// @access  Private
const updateBook = asyncHandler(async (req, res) => {
	// Get the logged user's book
	const id = req.params.id;
	const book = await Book.findById(id);

	if (!book) {
		res.status(400);
		throw new Error(`Book with id: ${id} not found`);
	}

	// Check if the user is logged in
	if (!req.user) {
		res.sendStatus(401);
		throw new Error(`User with id: ${id} not found`);
	}

	// Make sure that the book does indeed belongs to the logged user
	if (book.user.toString() !== req.user.id) {
		res.status(401);
		throw new Error('User is not authorized');
	}

	const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });

	res.status(200).json(updatedBook);
});

// @desc    Delete password
// @route   DELETE /api/book/:id
// @access  Private
const deleteBook = asyncHandler(async (req, res) => {
	const bookId = req.params.id;
	const book = await Book.findById(bookId);

	if (!book) {
		res.status(400);
		throw new Error(`Book with id: ${id} not found`);
	}

	// Check if the user is logged in
	if (!req.user) {
		res.sendStatus(401);
		throw new Error(`User with id: ${id} not found`);
	}

	// Make sure that the book does indeed belongs to the logged user
	if (book.user.toString() !== req.user.id) {
		res.status(401);
		throw new Error('User is not authorized');
	}

	await book.remove();

	res.status(200).json({ id: bookId });
});

module.exports = {
	getBook,
	setBook,
	updateBook,
	deleteBook,
};
