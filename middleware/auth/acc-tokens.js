const authConfig = require('../../config/auth.config');
const authUtils = require('../../utils/auth');
const InkError = require('../../common/models/ink-errors');
const Res = require('../../common/models/responses');

/**
 * verify payload of the access_token
 */
function verifyPayload(payload, req) {

}

module.exports = async function(req, res, next) {
    try {
        let accToken = req.cookies['access_token'];
        let payload = await authUtils.verifyToken(accToken, 'access_token', authConfig.publicKey);
        verifyPayload(payload, req);
        next();
    } catch (err) {
        if (err instanceof InkError.NoAuthorization) {
            let resPayload = new Res.Forbidden();
            res.status(resPayload.status).json(resPayload);
        } else {
            // unknown erro, let express handle
            next(err);
        }
    }
}
