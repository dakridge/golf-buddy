"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const getCourseById = (id) => {
    const course = Object.values(config_1.default.courses).find((course) => course.id === id);
    if (!course) {
        throw new Error(`Could not find course with id ${id}`);
    }
    return course;
};
exports.default = getCourseById;
