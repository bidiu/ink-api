const authService = require('../services/auth/auth');
const authConfig = require('../config/app.config').authConfig;
const Res = require('../common/models/responses');
const processPayload = require('../middleware/payload/payload');
const toCookie = require('../utils/auth').toCookie;
const maskCookie = require('../utils/auth').maskCookie;
const decodeToken = require('../utils/auth').decodeToken;

const mapTokensToCookies = (tokens) => {
    let cookies = tokens.map(toCookie);
    let maskedCookies = cookies.map(cookie => 
        maskCookie(cookie, '_mask', { httpOnly: false, path: '/' }));
    return [...cookies, ...maskedCookies];
};

/**
 * POST /auth/tokens (non-idempotent, but safe to call as many time as the client want)
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

    let { tokens, ...data } = await authService.create(scopes, { username, password, asGuest, refToken });
    let payload = await processPayload(new Res.Ok({ data }), req);
    mapTokensToCookies(tokens).forEach((cookie) => {
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

    let { tokens, ...data } = await authService.update(refToken);
    let payload = await processPayload(new Res.Ok({ data }), req);
    mapTokensToCookies(tokens).forEach((cookie) => {
        res.cookie(...cookie);
    });
    res.status(payload.status).json(payload);
};

/**
 * Log out, remove all refresh_token and access_tokens.
 * 
 * Note that it's safe to call this many times.
 * Also note that after logging out, instead of having no tokens,
 * the client will get guest's tokens.
 */
exports.destroy = async function(req, res, next) {
    let refToken = req.cookies['refresh_token'];

    // calling destroy is not necessary, but it will help verify the refresh token
    await authService.destroy(refToken);
    // now generate new guest tokens for client
    let { scopes } = decodeToken(refToken);
    let { tokens, ...data } = await authService.create(scopes, { asGuest: true });
    let payload = await processPayload(new Res.Ok({ data }), req);
    mapTokensToCookies(tokens).forEach((cookie) => {
        res.cookie(...cookie);
    });
    res.status(payload.status).json(payload);
};
