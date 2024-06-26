import jwt = require('jsonwebtoken');
import config, { getRandomRefreshSecret } from "../config/authConfig";
import { checkRefreshToken } from '../middleware/authValidation';

const refreshToken = (refreshjwt : string) : string => {

    const decoded = checkRefreshToken(refreshjwt);

    if(decoded) {
        return jwt.sign(
            {
                id : decoded.id,
                role: decoded.role,
            },
            getRandomRefreshSecret(),
            {
                expiresIn: config.token.expireTime,
                issuer: decoded.accessIssuer,
            },);
    }

    return "";
}

export default refreshToken;