const mongoose = require('mongoose');

const connectDB = async () => {
	const uri = process.env.MONGO_URI;

	try {
		const conn = await mongoose.connect(uri, { family: 4 });
		console.log(`MongoDB is connected to host: ${conn.connection.host}`);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

module.exports = connectDB;
