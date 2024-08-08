"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnumNames = void 0;
const getEnumNames = (enums) => {
    return enums.map((value) => { return value.Name; });
};
exports.getEnumNames = getEnumNames;
