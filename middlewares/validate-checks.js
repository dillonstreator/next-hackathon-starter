const { validationResult } = require("express-validator");

const onErrorsDefault = ({ req, res, next, errors }) =>
	res.status(400).json({ errors: errors.array() });

module.exports = ({ onErrors = onErrorsDefault } = {}) => (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return onErrors({ req, res, next, errors });
	} else {
		next();
	}
};
