"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageFromError = void 0;
var axios = __importStar(require("axios"));
var get_1 = __importDefault(require("lodash/get"));
var makeRequest = function (method) { return function (path, params) {
    return axios.default(__assign({ url: path, method: method }, params));
}; };
exports.default = {
    GET: makeRequest('GET'),
    POST: makeRequest('POST'),
    DELETE: makeRequest('DELETE'),
};
exports.messageFromError = function (error) {
    var message = '';
    var data = get_1.default(error, 'response.data', {});
    data = __assign({ errors: [], message: 'There was an issue' }, data);
    if (data.errors.length) {
        message = data.errors.map(function (_a) {
            var msg = _a.msg;
            return "" + msg;
        }).join('');
    }
    else {
        message = data.message;
    }
    return message;
};
