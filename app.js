const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const next = require("next");
const rTracer = require("cls-rtracer");
const helmet = require("helmet");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
const uuid = require("uuid");
const MongoStore = require("connect-mongo")(session);

const requestTimer = require("./middlewares/request-timer");
const requestPathLogger = require("./middlewares/request-path-logger");

const dev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

const app = next({ dev });

require("./db");

require("./config/passport");

app.prepare().then(() => {
	const server = express();

	server.use(rTracer.expressMiddleware());
	server.use(requestTimer);
	server.use(requestPathLogger);
	server.use(bodyParser.urlencoded({ extended: false }));
	server.use(bodyParser.json());
	server.use(helmet());

	server.use(
		session({
			resave: true,
			saveUninitialized: false,
			secret: uuid.v4(),
			cookie: { maxAge: 1000 * 60 * 60 * 24 * 14 }, // 14 days in milliseconds
			store: new MongoStore({
				url: process.env.DATABASE_URL,
				autoReconnect: true,
			}),
		})
	);
	server.use(passport.initialize());
	server.use(passport.session());

	server.use((req, res, n) => {
		res.nextApp = app;
		n();
	});

	server.use(require("./routes"));

	server.get("*", app.getRequestHandler());

	server.listen(PORT, (err) => {
		if (err) throw err;
		console.log(`listening on port ${PORT}`);
	});
});
