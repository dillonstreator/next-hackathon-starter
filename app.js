"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '.env') });
var express_1 = __importDefault(require("express"));
var next_1 = __importDefault(require("next"));
var cls_rtracer_1 = __importDefault(require("cls-rtracer"));
var helmet_1 = __importDefault(require("helmet"));
var passport_1 = __importDefault(require("passport"));
var body_parser_1 = __importDefault(require("body-parser"));
var express_session_1 = __importDefault(require("express-session"));
var uuid_1 = __importDefault(require("uuid"));
var connect_mongo_1 = __importDefault(require("connect-mongo"));
var logger_1 = __importDefault(require("./utils/logger"));
var request_timer_1 = __importDefault(require("./middlewares/request-timer"));
var request_path_logger_1 = __importDefault(require("./middlewares/request-path-logger"));
var MongoStore = connect_mongo_1.default(express_session_1.default);
var dev = process.env.NODE_ENV !== 'production';
var PORT = process.env.PORT || 5000;
var app = next_1.default({ dev: dev });
require('./db');
require('./config/passport');
app.prepare()
    .then(function () {
    var server = express_1.default();
    server.use(cls_rtracer_1.default.expressMiddleware());
    server.use(request_timer_1.default);
    server.use(request_path_logger_1.default);
    server.use(body_parser_1.default.json());
    server.use(body_parser_1.default.urlencoded({ extended: false }));
    server.use(helmet_1.default());
    server.use(express_session_1.default({
        resave: true,
        saveUninitialized: false,
        secret: uuid_1.default.v4(),
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 14 },
        store: new MongoStore({
            url: process.env.DATABASE_URL,
            autoReconnect: true,
        }),
    }));
    server.use(passport_1.default.initialize());
    server.use(passport_1.default.session());
    server.use(require('./routes'));
    server.get('*', app.getRequestHandler());
    server.listen(PORT, function () {
        console.log("listening on port " + PORT);
    });
})
    .catch(function (err) {
    logger_1.default.error(err);
    process.exit(1);
});
