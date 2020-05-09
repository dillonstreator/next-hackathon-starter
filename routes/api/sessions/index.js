const router = require("express").Router();
const { validationResult, check } = require("express-validator");
const passport = require("passport");
const logger = require("../../../utils/logger");

router.get("/", (req, res) => {
	if (req.isAuthenticated()) return res.sendStatus(200);
	else return res.sendStatus(404);
});

router.post(
	"/",
	[
		check("email").isEmail().withMessage("email has invalid format"),
		check("password").notEmpty().withMessage("password is required"),
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		passport.authenticate("local", (err, user, info) => {
			if (err) return res.status(400).json(info);
			if (!user) return res.status(400).json(info);

			req.logIn(user, (err) => {
				if (err) {
					logger.error(err);
					return res.sendStatus(500);
				}

				const { returnTo } = req.session;
				return res
					.status(200)
					.json({ message: "Successfully logged in!", returnTo });
			});
		})(req, res, next);
	}
);

router.delete("/", (req, res) => {
	req.logout();
	req.session.destroy((err) => {
		req.user = null;
		return res.sendStatus(200);
	});
});

module.exports = router;
