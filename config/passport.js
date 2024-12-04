const User = require("../models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
	// Google Strategy for OAuth
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: "/auth/google/callback",
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					let user = await User.findOne({ googleId: profile.id });

					//   when user already logged in with email
					if (!user) {
						user = await User.findOne({ email: profile.emails[0].value });

						user.googleId = profile.id;
						user.isVerified = true;

						await user.save();
					}

					if (!user) {
						user = await new User({
							googleId: profile.id,
							name: profile.displayName,
							email: profile.emails[0].value,
							isVerified: true,
						}).save();
					}

					done(null, user);
				} catch (err) {
					done(err, false);
				}
			}
		)
	);

	// Local Strategy
	passport.use(
		new LocalStrategy(
			{ usernameField: "email" },
			async (email, password, done) => {
				try {
					console.log(email, password);
					const user = await User.findOne({ email });
					if (!user) return done(null, false, { message: "No user found" });

					const isMatch = await user.comparePassword(password);
					if (!isMatch)
						return done(null, false, { message: "Incorrect password" });
					return done(null, user);
				} catch (err) {
					done(err, false);
				}
			}
		)
	);

	// Serialize User
	passport.serializeUser((user, done) => done(null, user.id));

	// Deserialize User
	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id);
			done(null, user);
		} catch (err) {
			done(err, false);
		}
	});
};
