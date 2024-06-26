import { randomInt } from "crypto";

const JWT_KEY = "cYscIXvgwx1ELOvhp2Clr91GH4faJRSLhawlqjyw";
export const JWT_EXPIRE_TIME = '10m';
export const JWT_ISSUER = 'AutoWorks'

const REFRESH_KEY = "UgFJJqOrCPvSAkaq0GXF1y6UQkKa1TLvRAJSP08ZTlwdtm0tlzCfgcNsElpyw6rQGPp8ej"
export const REFRESH_EXPIRE_TIME = '24h';

const refreshToken = {
    expireTime: REFRESH_EXPIRE_TIME,
    secret: REFRESH_KEY
}

const token = {
    expireTime: JWT_EXPIRE_TIME,
    issuer: JWT_ISSUER,
    secret: JWT_KEY,
}

export default {token , refreshToken};

export const ACCESS_SECRETS = [
    "UDlQmDppTPdZBC9xmSW9j8Qo7BH3hZeDEP1qlIDAzljMpXfYfpyIsQoi5sKXFmx6",
    "eRJBt9CpqHilXpaXh01sEJzb5YELWp2v5ZO1SBZRp2MXpyD3hwTtHB9cVS99pk0u",
    "DHVH7mLMB6OyeWwxc5PlY1zhpzWUZBxH6CMZzbc0js2qsIlIDOFR4u693xjcTeii",
    "58oCXGdr1e4ctzpyIwtyfcP5F7sfCothpKgwhLObJRfDo6TPEMOUJaVBkkhvjK9G",
    "0dlr00Sv4KXaCL8zDpZvXiweGWAEYXZP0aRQqbfrc2hMB0dcuBScSTWVWYUPlc92"
]

export const REFRESH_SECRETS = [
    "32ziXxriOkQ0GsjevwmCf6UbiJkLAwt76Xvm7MUZacC6do92vQpbiYqVPW5Xdfrp",
    "Ja90eTkqpWPh5Uta6Bo9Cvd7Ih9Lydmi3ueLRpp4PKFhgtVVDwuKauf2K1StG1GG",
    "GTXuSI4Kh6VtfA8uaMHoAizWIMLxB9S51xIR1WLrx1U3gtXX99GmTc6wcZFoZLvk",
    "fXrLqUdBATcW1LZdZWKZCZdC4dOw8Ih6Qhpd6k966ULKJWP6ZSpxtJEtyv4GkCHq",
    "atABWaHwTy77maouVitrOsdZHFKVjjXWSxLULa96YeyCkGpCOYRrJOURrTs1AimY"
]

export const getRandomAccessSecret = () =>{
    return ACCESS_SECRETS[randomInt(ACCESS_SECRETS.length)]
}

export const getRandomRefreshSecret = () => {
    return REFRESH_SECRETS[randomInt(REFRESH_SECRETS.length)]
}