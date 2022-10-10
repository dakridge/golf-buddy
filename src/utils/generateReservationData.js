"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const generateReservationData = (reservation) => {
    const data = {
        courseId: reservation.courseId,
        teetime: reservation.teeTime,
        rateId: reservation.rateId,
        cartId: reservation.cartId,
        cartItemId: reservation.cartItemId,
        tags: "ONLINE",
        golferQuantity: reservation.golfersCount,
        alias: " fairfax-county-mco",
        ttl: (0, date_fns_1.formatISO)((0, date_fns_1.addMinutes)(new Date(), 5)),
        sessionToken: reservation.token,
    };
    return `427["createReservation", ${JSON.stringify(data)}]`;
};
exports.default = generateReservationData;
