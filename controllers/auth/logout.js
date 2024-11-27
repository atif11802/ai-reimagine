

module.exports = (req, res) => {
	req.logout(() => {
		return res.json({ message: 'Logged out successfully' });
	});
};