"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
let cartId = '419372de-de17-4c50-b373-22c366f0fc9f';
const getCartId = () => {
    if (cartId) {
        return cartId;
    }
    cartId = (0, uuid_1.v4)();
    return cartId;
};
exports.default = getCartId;
