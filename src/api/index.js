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
exports.generateReservation = exports.addReservation = exports.getCart = exports.createCart = exports.deleteCartItem = exports.updateCartWithReservationId = exports.addTeeTimeToCart = exports.getTeeTimes = exports.authenticate = void 0;
const ws_1 = __importDefault(require("ws"));
const fs_extra_1 = require("fs-extra");
// Project
const config_1 = __importDefault(require("../config"));
const state_1 = require("../utils/state");
const makeRequest_1 = __importDefault(require("../utils/makeRequest"));
const generateReservationData_1 = __importDefault(require("../utils/generateReservationData"));
// authenticates to the teeitup api
const authenticate = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = config_1.default.email;
    const password = config_1.default.password;
    try {
        const storedToken = yield (0, fs_extra_1.readFile)('./credentials.txt', 'utf8');
        return { sessionToken: storedToken };
    }
    catch (error) {
    }
    const url = "https://phx-api-be-east-1b.kenna.io/profile/authenticate";
    const response = yield (0, makeRequest_1.default)(url, "POST", {
        data: {
            credentials: password,
            username: email,
            type: "basic",
        },
    });
    yield (0, fs_extra_1.writeFile)('./credentials.txt', response.sessionToken);
    return {
        sessionToken: (_a = response === null || response === void 0 ? void 0 : response.sessionToken) !== null && _a !== void 0 ? _a : null,
    };
});
exports.authenticate = authenticate;
const getTeeTimes = (courseIds, dateString) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://phx-api-be-east-1b.kenna.io/tee-times`;
    const response = yield (0, makeRequest_1.default)(url, "GET", {
        params: {
            courseIds: courseIds.join(','),
            date: dateString,
        },
    });
    return response[0];
});
exports.getTeeTimes = getTeeTimes;
const addTeeTimeToCart = (teetime) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://phx-api-be-east-1b.kenna.io/shopping-cart/${(0, state_1.getState)('cartId')}/cart-item`;
    const data = {
        item: {
            facilityId: teetime.rates[0].golfFacilityId,
            type: "TeeTime",
            extra: {
                featuredProducts: [],
                players: 1,
                price: teetime.rates[0].greenFeeWalking / 100,
                teetime: teetime.teetime,
                rate: {
                    holes: 18,
                    name: "18 Holes",
                    rateId: teetime.rates[0].golfnow.TTTeeTimeId,
                    rateSetId: teetime.rates[0].golfnow.GolfCourseId,
                    transportation: "Walking",
                },
            },
        },
    };
    const response = yield (0, makeRequest_1.default)(url, "POST", {
        data: data,
        token: (0, state_1.getState)('sessionToken'),
    });
    return response;
});
exports.addTeeTimeToCart = addTeeTimeToCart;
const updateCartWithReservationId = (reservationId, cartItem) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://phx-api-be-east-1b.kenna.io/shopping-cart/${(0, state_1.getState)('cartId')}/cart-item/${cartItem.id}`;
    const data = {
        item: Object.assign({}, cartItem)
    };
    data.item.extra.reservationId = reservationId;
    const response = yield (0, makeRequest_1.default)(url, "PATCH", {
        data: data,
        token: (0, state_1.getState)('sessionToken'),
    });
});
exports.updateCartWithReservationId = updateCartWithReservationId;
const deleteCartItem = (cartItemId, removeChildren) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://phx-api-be-east-1b.kenna.io/shopping-cart/${(0, state_1.getState)('cartId')}/cart-item/${cartItemId}?removeChildren=${removeChildren.toString()}`;
    const response = yield (0, makeRequest_1.default)(url, "DELETE", {
        token: (0, state_1.getState)('sessionToken'),
    });
});
exports.deleteCartItem = deleteCartItem;
const createCart = () => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://phx-api-be-east-1b.kenna.io/shopping-cart`;
    const response = yield (0, makeRequest_1.default)(url, "POST", {
        token: (0, state_1.getState)('sessionToken'),
    });
    return response;
});
exports.createCart = createCart;
const getCart = (sessionToken) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://phx-api-be-east-1b.kenna.io/shopping-cart/${(0, state_1.getState)('cartId')}`;
    const response = yield (0, makeRequest_1.default)(url, "GET", {
        token: sessionToken,
    });
    return response;
});
exports.getCart = getCart;
const addReservation = (reservation) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://tr.gnsvc.com/AddReservation";
    // get form data
    const formData = new URLSearchParams({
        "Token": reservation.reservation.transaction.authToken,
        "TeeTime.InventoryChannelID": reservation.reservation.transaction.invoice.ChannelId,
        "TeeTime.FacilityID": reservation.reservation.teetimes[0].rate.golfnow.GolfFacilityId.toString(),
        "TeeTime.TeeTimeRateID": reservation.reservation.teetimes[0].rate.golfnow.TTTeeTimeId.toString(),
        "TeeTime.PlayerCount": reservation.reservation.totalPlayers.toString(),
        "TeeTime.Amount": "-1",
        "TeeTime.ReferenceID": reservation.reservation.transaction.invoice.ReferenceId,
        "Reservation.CustomerEmail": config_1.default.email,
        "SelectedCourses": reservation.reservation.teetimes[0].rate.golfnow.GolfFacilityId.toString(),
        "ENGINE": "5.0",
        "ALIAS": "fairfax-county-mco",
        "Reservation.TrackingCode": `TL:${reservation.reservation._id}`,
        "tl.holes": reservation.reservation.transaction.invoice.HoleCount.toString(),
        "EmailCampaignId": "",
        "PaymentReturnURL": "https://fairfax-county-mco.book.teeitup.golf/payment-authorization",
        "Payment.Name": config_1.default.name,
        "Payment.Address.Line1": "",
        "Payment.Address.PostalCode": "",
        "Payment.Address.Country": "",
        "tl.customerMobile": config_1.default.phone,
        "Payment.PhoneNumber": config_1.default.phone,
    });
    const response = yield (0, makeRequest_1.default)(url, "POST", {
        data: formData,
        overrideHeaders: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    const successfulBooking = response.StatusCode === 200 && response.PaymentStatus === "Processed" && response.Success === true;
    if (successfulBooking) {
        return response;
    }
    else {
        console.log('RESERVATION RESPONSE: ', response);
        throw new Error("Failed to add reservation");
    }
});
exports.addReservation = addReservation;
const generateReservation = (teeTime, cart) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const ws = new ws_1.default("wss://fairfax-county-mco.book.teeitup.golf/socket.io/?EIO=3&transport=websocket");
        ws.addEventListener("open", () => {
            // create a reservation
            const message = (0, generateReservationData_1.default)({
                courseId: teeTime.courseId,
                teeTime: teeTime.teetime,
                rateId: teeTime.rates[0].golfnow.TTTeeTimeId,
                cartId: cart.id,
                cartItemId: cart.items[0].id,
                golfersCount: cart.items[0].extra.players,
                token: (0, state_1.getState)("sessionToken"),
            });
            ws.send(message);
        });
        ws.addEventListener("message", (event) => {
            if (typeof event.data === 'string' && event.data.startsWith('437')) {
                const data = JSON.parse(event.data.slice(3));
                resolve(data[0]);
            }
        });
    });
});
exports.generateReservation = generateReservation;
