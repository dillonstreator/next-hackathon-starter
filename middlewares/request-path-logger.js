"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __importDefault(require("../utils/logger"));
exports.default = (function (req, res, next) {
    logger_1.default.info(req.method + " " + req.url);
    next();
});
