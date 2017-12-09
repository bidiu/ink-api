const ms = require('ms');
const authService = require('../services/auth/auth');
const authConfig = require('../config/app.config').authConfig;
const Res = require('../common/models/responses');
const processPayload = require('../middleware/payload/payload');
const toCookie = require('../utils/auth').toCookie;

/**
 * POST /auth/tokens (non-idempotent, but safe call as many time as the client want)
 * 
 * Log in (or as guest): requst one or more access_tokens and one refresh_tokens
 * for refreshing these access_tokens.
 * 
 * params: 
 *      - username/email? + password?
 *      - asGuest?
 *      - scopes
 *      - refresh_token as cookie
 */
exports.create = async function(req, res, next) {
    let { scopes, username, password, asGuest } = req.body;
    let refToken = req.cookies['refresh_token'];

    let { tokens, sub } = await authService.create(scopes, { username, password, asGuest, refToken });
    let payload = await processPayload(new Res.Ok({ data: { sub } }), req);
    
    tokens.map(toCookie).forEach((cookie) => {
        res.cookie(...cookie);
    });
    res.status(payload.status).json(payload);
};

/**
 * PATCH /auth/tokens
 * 
 * refresh access_tokens
 * 
 * params:
 *      - refresh_token as cookie
 */
exports.update = async function(req, res, next) {
    let refToken = req.cookies['refresh_token'];

    let { tokens, sub } = await authService.update(refToken);
    let payload = await processPayload(new Res.Ok({ data: { sub } }), req);
    
    tokens.map(toCookie).forEach((cookie) => {
        res.cookie(...cookie);
    });
    res.status(payload.status).json(payload);
};

/**
 * log out, remove all refresh_token and access_tokens
 * note that it's safe to call this many times
 */
exports.destroy = async function(req, res, next) {
    let refToken = req.cookies['refresh_token'];

    let tokens = await authService.destroy(refToken);
    let payload = await processPayload(new Res.Ok(), req);

    tokens.map(toCookie).forEach((cookie) => {
        res.cookie(...cookie);
    });
    res.status(payload.status).json(payload);
};
