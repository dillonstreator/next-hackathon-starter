const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		email: { type: String, unique: true },
		password: String,
		passwordResetToken: String,
		passwordResetExpires: Date,
		emailVerificationToken: String,
		emailVerified: Boolean,
		profile: {
			name: String,
			picture: String,
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(12);
		const hashedPassword = await bcrypt.hash(this.password, salt);
		this.password = hashedPassword;
		next();
	} catch (err) {
		return next(err);
	}
});

userSchema.pre("save", function(next) {
	if (!this.profile) this.profile = {};

	if (!this.profile.name) this.profile.name = this.email.split("@")[0];
	if (!this.profile.picture) this.profile.picture = User.gravatar({ email: this.email });

	next();
});


userSchema.methods.basicInfoCompleted = function () {
	try {
		return this.emailVerified && this.profile.name;
	} catch (e) {
		return false;
	}
};

userSchema.methods.comparePassword = function (incoming) {
	return bcrypt.compare(incoming, this.password);
};

userSchema.statics.gravatar = function gravatar({ size = 200, email } = {}) {
	if (!email) return `https://gravatar.com/avatar/?s=${size}&d=retro`;

	const md5 = crypto.createHash("md5").update(email).digest("hex");
	return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
