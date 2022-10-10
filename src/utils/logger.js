"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = (log) => {
    if (log.type === 'info') {
        // console.log(log.message);
    }
    else {
        console.error(log.message);
    }
};
exports.default = logger;
