const router = require("express").Router();
const { check } = require("express-validator");
const rateLimit = require("express-rate-limit");
const _ = require("lodash");
const uuid = require("uuid");
const moment = require("moment");
const logger = require("../../../utils/logger");
const User = require("../../../db/models/User");
const mailer = require("../../../utils/mailer");
const { normalizeEmail } = require("../../../utils/normalizer");
const validateChecks = require("../../../middlewares/validate-checks");

const apiLimiter = rateLimit({
	windowMs: 1000 * 60 * 15,
	max: 100,
});

router.post(
	"/",
	[
		check("email").isEmail().withMessage("email has invalid format"),
		check("password")
			.isLength({ min: 8 })
			.withMessage("password must be 8 characters minimum"),
		check("passwordConfirm").custom((value, { req }) => {
			if (value !== req.body.password)
				throw new Error("Password confirmation does not match password.");

			return true;
		}),
	],
	validateChecks,
	rateLimit({
		windowMs: 1000 * 60 * 60,
		max: 10,
		message: "Too many accounts created, please try again in an hour.",
	}),
	async (req, res) => {
		const { email: rawEmail, password } = req.body;
		const email = normalizeEmail(rawEmail);

		const emailSentMessage = `An email with further instructions has been sent to ${email}`;
		try {
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				if (!existingUser.emailVerified)
					mailer.sendDuplicateAccountCreationNeedsVerification({ email });
				else mailer.sendDuplicateAccountCreation({ email });
				return res.status(200).json({ message: emailSentMessage });
			}

			const emailVerificationToken = uuid.v4();
			await User.create({
				email,
				password,
				emailVerificationToken,
			});

			mailer.sendEmailVerification({
				email,
				token: emailVerificationToken,
			});

			return res.status(200).json({ message: emailSentMessage });
		} catch (error) {
			logger.error(error);
			return res.status(500).json({
				error:
					"There was an issue processing that request. If this continues, please contact support.",
			});
		}
	}
);

// send new verification email
router.post(
	"/verify",
	[
		check("email")
			.notEmpty()
			.withMessage("email is required")
			.isEmail()
			.withMessage("email has invalid format"),
	],
	validateChecks,
	apiLimiter,
	async (req, res) => {
		const { email: rawEmail } = req.body;
		const email = normalizeEmail(rawEmail);

		try {
			const user = await User.findOne({ email });
			const emailSentMessageParanoid =
				"If your email address exists in our database, you will receive an email with instructions for how to confirm your email address in a few minutes.";
			if (!user) {
				return res.status(200).json({ message: emailSentMessageParanoid });
			}
			if (user.emailVerified) {
				mailer.sendEmailVerificationAlreadyVerified({ email });
				return res.status(200).json({ message: emailSentMessageParanoid });
			}

			const emailVerificationToken = uuid.v4();
			user.emailVerificationToken = emailVerificationToken;
			await user.save();

			mailer.sendEmailVerification({
				email,
				token: emailVerificationToken,
			});

			return res.status(200).json({ message: emailSentMessageParanoid });
		} catch (error) {
			logger.error(error);
			return res.status(500).json({
				error:
					"There was an issue processing that request. If this continues, please contact support.",
			});
		}
	}
);

// verify account/email
router.get("/verify/:token", apiLimiter, async (req, res) => {
	try {
		const emailVerificationToken = req.params.token;
		const user = await User.findOne({
			emailVerificationToken,
			emailVerified: { $ne: true },
		});

		if (!user) {
			return res.redirect("/account/email-verification-error");
		}

		if (user.emailVerified) {
			return res.redirect("/account/email-verification-success");
		}

		user.emailVerified = true;
		await user.save();

		return res.redirect("/account/email-verification-success");
	} catch (error) {
		logger.error(error);
		return res.sendStatus(500);
	}
});

router.post(
	"/forgot",
	[
		check("email")
			.notEmpty()
			.withMessage("email is required")
			.isEmail()
			.withMessage("email has invalid format"),
	],
	validateChecks,
	apiLimiter,
	async (req, res) => {
		const { email: rawEmail } = req.body;
		const email = normalizeEmail(rawEmail);

		try {
			const user = await User.findOne({ email });
			const emailSentMessageParanoid =
				"If your email address exists in our database, you will receive an email with instructions for how to reset your password in a minute.";
			if (!user) {
				return res.status(200).json({ message: emailSentMessageParanoid });
			}

			const passwordResetToken = uuid.v4();
			const passwordResetExpires = moment().add(30, "minutes");
			user.passwordResetToken = passwordResetToken;
			user.passwordResetExpires = passwordResetExpires;
			await user.save();

			mailer.sendPasswordReset({
				email,
				token: passwordResetToken,
				expires: passwordResetExpires,
			});

			return res.status(200).json({ message: emailSentMessageParanoid });
		} catch (error) {
			logger.error(error);
			return res.status(500).json({
				error:
					"There was an issue processing that request. If this continues, please contact support.",
			});
		}
	}
);

router.post(
	"/reset/:token",
	[
		check("password")
			.isLength({ min: 8 })
			.withMessage("password must be 8 characters minimum"),
	],
	validateChecks,
	apiLimiter,
	async (req, res) => {
		const { token } = req.params;
		const { password } = req.body;

		try {
			const user = await User.findOne({ passwordResetToken: token }).select(
				"password passwordResetExpires"
			);
			if (!user) {
				return res.status(200).json({
					message:
						"Invalid token. Please request a new reset password link.",
				});
			}
			const expired = moment().diff(moment(user.passwordResetExpires)) > 0;
			if (expired) {
				return res.status(200).json({
					message:
						"That link was expired. Please request a new reset password link.",
				});
			}

			user.passwordResetExpires = null;
			user.passwordResetToken = null;
			user.password = password;
			await user.save();

			return res
				.status(200)
				.json({ message: "Successfully reset password" });
		} catch (error) {
			logger.error(error);
			return res.status(500).json({
				error:
					"There was an issue processing that request. If this continues, please contact support.",
			});
		}
	}
);

module.exports = router;
