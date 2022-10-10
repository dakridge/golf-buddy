"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getState = exports.addToState = void 0;
const state = {
    cartId: '',
    sessionToken: '',
};
const addToState = (key, value) => {
    state[key] = value;
};
exports.addToState = addToState;
const getState = (key) => {
    return state[key];
};
exports.getState = getState;
