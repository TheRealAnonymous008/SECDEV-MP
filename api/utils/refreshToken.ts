import jwt = require('jsonwebtoken');
import { JWT_EXPIRE_TIME, getRandomRefreshSecret } from "../config/authConfig";
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
                expiresIn: JWT_EXPIRE_TIME,
                issuer: decoded.accessIssuer,
            },);
    }

    return "";
}

export default refreshToken;