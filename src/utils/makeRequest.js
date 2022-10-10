"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const makeRequest = (url, method, options) => __awaiter(void 0, void 0, void 0, function* () {
    const fullUrl = url;
    const headers = {
        session: (options === null || options === void 0 ? void 0 : options.token) ? options.token : "",
        "x-be-alias": "fairfax-county-mco",
        accept: "application/json, text/plain, */*",
        "Content-Type": "application/json;charset=UTF-8",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
    };
    const request = yield (0, axios_1.default)({
        method,
        url: fullUrl,
        headers: (options === null || options === void 0 ? void 0 : options.overrideHeaders) ? options.overrideHeaders : headers,
        data: options === null || options === void 0 ? void 0 : options.data,
        params: options === null || options === void 0 ? void 0 : options.params,
    });
    return request.data;
});
exports.default = makeRequest;
