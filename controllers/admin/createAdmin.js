const User = require('../../models/User.js');

module.exports = async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res.status(400).json({ message: 'All fields are required' });
	}

	try {
		// Check if the user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' });
		}

		// Create a new user with admin privileges
		const newUser = new User({
			name,
			email,
			password,
			isAdmin: true,
			isVerified: true,
		});

		// Save the user to the database
		await newUser.save();
		const { password, refreshToken, ...user } = newUser;

		return res
			.status(201)
			.json({ message: 'Admin user created successfully', user });
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error });
	}
};
