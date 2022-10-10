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
// Dependencies
const mailgun_js_1 = __importDefault(require("mailgun.js"));
const form_data_1 = __importDefault(require("form-data"));
const date_fns_1 = require("date-fns");
const config_1 = __importDefault(require("../config"));
const mailgun = new mailgun_js_1.default(form_data_1.default);
const notifyGolfers = (course, teeTime) => __awaiter(void 0, void 0, void 0, function* () {
    const bestTeeTimeDate = (0, date_fns_1.parseISO)(teeTime.teetime);
    const mg = mailgun.client({
        username: 'api',
        key: config_1.default.mailgunKey,
    });
    const data = {
        from: 'Golf Buddy <golf@hi.dougakridge.com>',
        to: config_1.default.golfers.map((golfer) => `${golfer.phone}@txt.att.net`),
        subject: `Teetime is booked!`,
        text: `I booked you guys a teetime for ${course.name} on ${(0, date_fns_1.format)(bestTeeTimeDate, 'E MMM d h:mm a')}`,
        html: ``,
    };
    const msg = yield mg.messages.create('hi.dougakridge.com', data);
    return msg;
});
exports.default = notifyGolfers;
