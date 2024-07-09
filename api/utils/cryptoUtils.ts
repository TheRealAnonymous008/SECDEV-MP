const crypto = require("crypto")
const uid = require('uid-safe')

export function hashSessionId(sessionId : string ) {
    const sessionIdBuffer = Buffer.from(sessionId);
    const hash = crypto.createHash('sha256');
    hash.update(sessionIdBuffer);
    return hash.digest('hex');
  }

export function getRandom(){
  return uid.sync(24)
}

export function getTimestamp(){
  return new Date().getTime()
}