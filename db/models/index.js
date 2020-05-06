const path = require("path");
const fs = require("fs");

const models = fs.readdirSync(__dirname).reduce((acc, file) => {
	if (file.includes("index")) return acc;

	const modelName = path.parse(file).name;

	acc[modelName] = require(path.join(__dirname, file));

	return acc;
}, {});

module.exports = models;
