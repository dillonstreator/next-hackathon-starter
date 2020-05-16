"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __importDefault(require("../utils/logger"));
exports.default = (function (req, res, next) {
    var startHrTime = process.hrtime();
    res.on('finish', function () {
        var elapsedHrTime = process.hrtime(startHrTime);
        var elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        logger_1.default.info("elapsed request time: " + elapsedTimeInMs + "ms");
    });
    next();
});
