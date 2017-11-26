const ms = require('ms');
const authService = require('../services/auth/auth');
const authConfig = require('../config/app.config').authConfig;
const Res = require('../common/models/responses');
const processPayload = require('../middleware/payload/payload');
const toCookie = require('../utils/auth').toCookie;

const CREATE_NOTE = 'You are responsible for storing user\'s tokens securely, especially for \'refresh_token\'.';

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
exports.create = function(req, res, next) {
    let { scopes, username, password, asGuest } = req.body;
    let refToken = req.cookies['refresh_token'];

    authService.create(scopes, { username, password, asGuest, refToken })
            .then((tokens) => {
                tokens.map(toCookie).forEach((cookie) => {
                    res.cookie(...cookie);
                });

                let payload = new Res.Ok({ details: CREATE_NOTE });
                payload = processPayload(payload, req);
                res.status(payload.status).json(payload);
            })
            .catch((err) => {
                next(err);
            });
};

/**
 * PATCH /auth/tokens
 * 
 * refresh access_tokens
 * 
 * params:
 *      - refresh_token as cookie
 */
exports.update = function(req, res, next) {
    let refToken = req.cookies['refresh_token'];

    return authService.update(refToken)
            .then((tokens) => {
                tokens.map(toCookie).forEach((cookie) => {
                    res.cookie(...cookie);
                });

                let payload = new Res.Ok();
                payload = processPayload(payload, req);
                res.status(payload.status).json(payload);
            })
            .catch((err) => {
                next(err);
            });;
};

/**
 * log out, remove all refresh_token and access_tokens
 * note that it's safe to call this many times
 */
exports.destroy = function(req, res, next) {
    let refToken = req.cookies['refresh_token'];

    return authService.destroy(refToken)
            .then((tokens) => {
                tokens.map(toCookie).forEach((cookie) => {
                    res.cookie(...cookie);
                });

                let payload = new Res.Ok();
                payload = processPayload(payload, req);
                res.status(payload.status).json(payload);
            })
            .catch((err) => {
                next(err);
            });;
};
