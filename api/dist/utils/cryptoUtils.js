"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashSessionId = void 0;
const crypto = require("crypto");
function hashSessionId(sessionId) {
    const sessionIdBuffer = Buffer.from(sessionId);
    const hash = crypto.createHash('sha256');
    hash.update(sessionIdBuffer);
    return hash.digest('hex');
}
exports.hashSessionId = hashSessionId;
