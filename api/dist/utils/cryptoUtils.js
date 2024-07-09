"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimestamp = exports.getRandom = exports.hashSessionId = void 0;
const crypto = require("crypto");
const uid = require('uid-safe');
function hashSessionId(sessionId) {
    const sessionIdBuffer = Buffer.from(sessionId);
    const hash = crypto.createHash('sha256');
    hash.update(sessionIdBuffer);
    return hash.digest('hex');
}
exports.hashSessionId = hashSessionId;
function getRandom() {
    return uid.sync(24);
}
exports.getRandom = getRandom;
function getTimestamp() {
    return new Date().getTime();
}
exports.getTimestamp = getTimestamp;
