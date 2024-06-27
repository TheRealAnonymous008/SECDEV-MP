import { randomInt } from "crypto";

export const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME;
export const JWT_ISSUER = process.env.JWT_ISSUER
export const REFRESH_EXPIRE_TIME = process.env.REFRESH_EXPIRE_TIME;

export const ACCESS_SECRETS = JSON.parse(process.env.ACCESS_SECRETS)
export const REFRESH_SECRETS = JSON.parse(process.env.REFRESH_SECRETS)

export const getRandomAccessSecret = () =>{
    return ACCESS_SECRETS[randomInt(ACCESS_SECRETS.length)]
}

export const getRandomRefreshSecret = () => {
    return REFRESH_SECRETS[randomInt(REFRESH_SECRETS.length)]
}