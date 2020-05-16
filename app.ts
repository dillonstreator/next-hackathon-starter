import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import next from "next";
import rTracer from "cls-rtracer";
import helmet from "helmet";
import passport from "passport";
import bodyParser from "body-parser";
import session from "express-session";
import uuid from "uuid";
import connectMongo from "connect-mongo";

import logger from "./utils/logger";

import requestTimer from "./middlewares/request-timer";
import requestPathLogger from "./middlewares/request-path-logger";

const MongoStore = connectMongo(session);

const dev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

const app = next({ dev });

require("./db");

require("./config/passport");

app.prepare()
	.then(() => {
		const server: express.Application = express();

		server.use(rTracer.expressMiddleware());
		server.use(requestTimer);
		server.use(requestPathLogger);
		server.use(bodyParser.json());
		server.use(bodyParser.urlencoded({ extended: false }));
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

		server.use(require("./routes"));

		server.get("*", app.getRequestHandler());

		server.listen(PORT, () => {
			console.log(`listening on port ${PORT}`);
		});
	})
	.catch((err) => {
		logger.error(err);
		process.exit(1);
	});
