const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const User = require("../db/models/User");

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, done);
});

/**
 * Sign in using Email and Password.
 */
passport.use(
	new LocalStrategy(
		{ usernameField: "email" },
		async (email, password, done) => {
			const invalidEmailOrPassword = "Invalid email or password";
			try {
				const user = await User.findOne({ email });
				if (!user.emailVerified)
					return done(null, false, {
						message: "Email requires verification",
					});
				if (!user)
					return done(null, false, { message: invalidEmailOrPassword });

				const passwordMatch = await user.comparePassword(password);
				if (!passwordMatch)
					return done(null, false, { message: invalidEmailOrPassword });

				return done(null, user);
			} catch (error) {
				return done(error);
			}
		}
	)
);
