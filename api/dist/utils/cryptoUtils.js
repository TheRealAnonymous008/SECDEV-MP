"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimestamp = exports.getRandom = exports.hashId = void 0;
const crypto = require("crypto");
const uid = require('uid-safe');
function hashId(sessionId) {
    const sessionIdBuffer = Buffer.from(sessionId);
    const hash = crypto.createHash('sha256');
    hash.update(sessionIdBuffer);
    return hash.digest('hex');
}
exports.hashId = hashId;
function getRandom() {
    return uid.sync(24);
}
exports.getRandom = getRandom;
function getTimestamp() {
    return new Date().getTime();
}
exports.getTimestamp = getTimestamp;
