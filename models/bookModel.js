const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		name: { type: String },
		author: { type: String },
		chapters: [
			{
				title: String,
				image: { data: Buffer, contentType: String },
				locations: [
					{
						country: String,
						city: String,
						street: String,
						hotel: String,
					},
				],
				pages: [
					{
						title: { type: String },
						content: {
							type: String,
						},
						attractions: [
							{
								name: {
									type: String,
								},
								image: { data: Buffer, contentType: String },
							},
						],
					},
				],
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema, 'books');
