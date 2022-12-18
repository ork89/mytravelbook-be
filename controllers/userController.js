const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel.js');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	// verify request integrity
	if (!name || !email || !password) {
		res.status(400);
		throw new Error('Please fill all fields');
	}

	// verify that user exists
	const isUserExist = await User.findOne({ email });

	if (isUserExist) {
		res.status(400);
		throw new Error('User already exists');
	}

	// Hashing password
	const salt = await bcrypt.genSalt(10);
	const hashedPwd = await bcrypt.hash(password, salt);

	// Create user
	const newUser = await User.create({
		name,
		email,
		password: hashedPwd,
	});

	if (newUser) {
		return res.status(201).json({
			_id: newUser.id,
			name: newUser.name,
			email: newUser.email,
			token: generateToken(newUser._id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// Find user by email
	const user = await User.findOne({ email });

	// Compare the password from the login with the one listed for the user in the DB
	if (user && (await bcrypt.compare(password, user.password))) {
		res.json({
			_id: user.id,
			name: user.name,
			email: user.email,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid credentials');
	}

	res.json({ message: 'Login user' });
});

// @desc    Get current logged user data
// @route   GET /api/users/currentUser
// @access  Private
const getCurrentUser = asyncHandler(async (req, res) => {
	res.status(200).json(req.user);
});

// @desc	Update current user
// @route	PUT /api/users/id
// @access	Private
const updateUser = asyncHandler(async (req, res) => {
	const userId = req.params.id;
	const user = await User.findById(userId);

	if (!user) {
		res.status(400);
		throw new Error(`User with Id: ${userId} does not exist`);
	}

	// Hashing password
	const salt = await bcrypt.genSalt(10);
	const hashedPwd = await bcrypt.hash(req.body.password, salt);

	if (!(await bcrypt.compare(user.password, hashedPwd))) {
		req.body.password = hashedPwd;
	}

	// Update the user's data
	const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
	res.status(200).json(updatedUser);
});

// @desc	Delete current user
// @route	DELETE /api/users/id
// @access	Private

const unregisterUser = asyncHandler(async (req, res) => {
	const userId = req.params.id;
	const user = await User.findById(userId);

	if (!user) {
		res.status(400);
		throw new Error(`User with Id: ${userId} does not exist`);
	}

	await User.deleteOne();

	res.status(200).send(`User ${user.name} id: ${userId} was successfully unregistered`);
});

// Generate JWT Token
const generateToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { registerUser, loginUser, getCurrentUser, updateUser, unregisterUser };
