const models = require("./models");
const logger = require("../utils/logger");
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }, (err) => {
	if (err) logger.error(err);
	else logger.info("database connected successfully");
});

exports.models = models;
