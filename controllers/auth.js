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
 * 
 * > What if already logged in?
 * Note that logging in here could be either logging in with an registered account, 
 * or as a guest user. And also it is totally okay to call this endpoint second time
 * after first time succeeded. This is because this endpoint is not technically for
 * logging in (thus not trying to log in after already logged in), but for requesting 
 * access tokens; a client may request several access tokens for different scopes with 
 * more than one request.
 * 
 * First, you need to understand what logging in really means. Basically, if 
 * a valid refresh_token (not expires, not tampered, not in blacklist, etc.) 
 * shows up in the cookie, '/auth/tokens' will think the client has logged in 
 * (either as a registered account or guest). If client call this endpoint again 
 * after logging in, the outcome depends on the differences of the 'scopes' param 
 * between two consecutive requests. If the scope is the same (note that all scope 
 * comparions are after sanitizing these scopes) as previous one, system WON'T bother
 * doing anything (because client is requesting what it already has). Note that in this
 * case, the refresh_token won't be refreshed. This is the design: refresh_token is long-
 * lived (1 month, typically) and itself cannot be refreshed. In other words, user 
 * cannot log in forever, even though the user is using it constantly. At some point, 
 * user has to re-type in his/her credentials to access another refresh_token and its
 * access_tokens (log in again). 
 * 
 * If, in other cases, the client tries to enlarge the 'scopes', then the credential 
 * has to be provided again (or set 'asGuest' true again).
 * 
 * The outcome of calling this endpoint after a successful call actually also depends
 * on another situation. Please see down below.
 * 
 * 
 * > What if 2 requests are with different accounts (2 different accounts or guest)?
 * Again (repeat of above), if the 'refresh_token' of second call is not valid (expired, 
 * tampered, in blacklist), this endpoint might send a 401 response to the client, or
 * might just discard the 'refresh_token' (think the user haven't logged in yet, thus start
 * a new requesting-access-token process) - which case really depends on the JWT implementation.
 * |
 * |
 * |/
 * '
 * <Fix>
 * First, you need to understand that I really don't want a client instance (like Chrome) holds
 * two user's valid refresh_tokens (does not care guest) at the same time, because refresh_token 
 * really means the login state of an account (even access_token is not important at all). You
 * don't want chrome logging in as two users. The server cannot guarantee this, because client 
 * can do many tricks to lie to the server. But server still will do its best to prevent this.
 * 
 * If in any case user tries to tamper the refresh_token, no matter whetter the refresh_token is
 * expired or not, 401 will always be sent back (user has to clear its cookie to reset everything).
 * If the refresh_token just expires or in the blacklist, server will think the user is logged out,
 * a fresh new requesting-access-token process (or say, login process) will start. If refresh_token
 * is okay, the server will think either client is trying to change the scope (enlarge, shrink), or
 * client sent this request wrongly to acquire what it already has. More details see down below. 
 * </Fix>
 * 
 * As long as second time the refresh token is all good, system will think the client 
 * has logged in. And if the client is trying to add new scopes to access, system will verify 
 * the credentials (username/email/password or as guest) against the 'sub' and 'asGuest' in the
 * refresh token. If subjects are not same, 401 will be returned.
 * 
 * Note that there is an exception, switching from guest to a user is allowed (you don't need to
 * log out from guest before logging in as a registered account). 
 * 
 * 
 * params: 
 *      - username/email? + password?
 *      - asGuest?
 *      - scopes
 *      - refresh_token as cookie
 */
exports.create = function(req, res, next) {
    let { scopes, username, password, asGuest } = req.body;
    let refToken = req.cookies.refresh_token;

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
    res.end('refresh tokens');
};

/**
 * log out, remove all refresh_token and access_tokens
 */
exports.destroy = function(req,res, next) {
    res.end('log out');
};
