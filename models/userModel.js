const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'User name is missing'],
			min: 2,
			max: 50,
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'Email address is missing'],
			trim: true,
		},
		password: {
			type: String,
			required: [true, 'Password is missing'],
			min: 8,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema, 'users');
