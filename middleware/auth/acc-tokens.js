const authConfig = require('../../config/auth.config');
const authUtils = require('../../utils/auth');
const InkError = require('../../common/models/ink-errors');
const Res = require('../../common/models/responses');
const userService = require('../../services/users.v1');
const toRegex = require('path-to-regexp');

/**
 * verify payload of the access_token, and add the auth info to `req`
 * 
 * @return {Promise<void>} resolving undefined
 */
async function verifyPayload(payload, req) {
    let requestedPath = req.baseUrl + req.path;
    let endpoint = payload.endpoints.find(({ path }) => toRegex(path).test(requestedPath));

    if (endpoint && endpoint.methods.includes(req.method)) {
        let auth = { sub: payload.sub } // user id
        if (authConfig.eagerLoading) {
            auth.user = await userService.retrieveV2({ id: auth.sub });
        }
        req.auth = auth;
    } else {
        // client is not authorized for the requested path
        throw new InkError.NoAuthorization();
    }
}

module.exports = async function(req, res, next) {
    try {
        let accToken = req.cookies['access_token'];
        let payload = await authUtils.verifyToken(accToken, 'access_token', authConfig.publicKey);
        await verifyPayload(payload, req);
        // authorization is all good
        next();
    } catch (err) {
        if (err instanceof InkError.NoAuthorization) {
            let resPayload = new Res.Forbidden();
            res.status(resPayload.status).json(resPayload);
        } else {
            // unknown error, let express handle
            next(err);
        }
    }
}
