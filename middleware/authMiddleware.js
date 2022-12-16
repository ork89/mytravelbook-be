const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, nextFunc) => {
	let token;
	const authHeader = req.headers.authorization;

	if (authHeader && authHeader.startsWith('Bearer')) {
		try {
			// getting the token from the authorization header
			token = authHeader.split(' ')[1];

			// verifying token
			const decode = jwt.verify(token, process.env.JWT_SECRET);

			// get the user from the token's payload
			req.user = await User.findById(decode.id).select('-password');

			// call the next middleware
			nextFunc();
		} catch (error) {
			console.error(error);
			res.status(401);
			throw new Error('Authorization Failed');
		}
	}

	if (!token) {
		res.status(401);
		throw new Error("Authorization failed because there's no token");
	}
});

module.exports = { protect };
