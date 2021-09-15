import { UnauthorizedError } from '../utils/errors';
import {multiLanguage} from '../utils/Language';

function tokenDecoder(debug = false) {
    return (req, res, next) => {
        const { authorizer } = req.requestContext || {};
        const decoded = {
            user: authorizer && authorizer.claims ? JSON.parse(authorizer.claims) : null,
            realms: authorizer?.realms ? authorizer.realms.split(' ') : [],
        };

        if (debug) {
            console.log('token:', JSON.stringify(decoded, null, 2));
        }
        req.token = decoded;
        next();
    };
}

export default tokenDecoder;

export function hasRealms(realms) {
    return (req, res, next) => {
        const currentRealms = req.token?.realms || [];
        if (realms.length === 0 || !(realms.map(e => currentRealms.includes(e))).includes(false)) {
            next();
        } else {
            const lang = req.headers['accept-language'] || 'pt';
            throw new UnauthorizedError(multiLanguage[lang].UNAUTHORIZED_REALMS);
        }
    };
}
