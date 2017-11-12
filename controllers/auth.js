/**
 * POST /auth/tokens
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
 * access token; a client may request several access tokens for different scopes with 
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
 * lived and itself cannot be refreshed (in other word, user cannot log in forever, 
 * even though the user is using it forever). 
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
 * TDOD so the implementation really need to be taken care of.
 * 
 * As long as second time the refresh token is all good, system will think the client 
 * has logged in. And if the client is trying to add more scopes to access, system will verify 
 * the credentials (username/email/password or as guest) against the 'sub' and 'asGuest' in the
 * refresh token. If subjects are not same, 401 will be returned.
 * 
 * Note that there is an exception, switching from guest to a user is allowed (you don't need to
 * log out from guest before logging in as a registered account). 
 * TODO so implementation need to take care of this.
 * 
 * 
 * TODO how client take of these errors (how to retry after auth error)
 * 
 * params: 
 *      - username/email + password
 *      - asGuest?
 *      - scopes
 *      - refresh_token as cookie
 */
exports.create = function(req, res, next) {
    res.end('gen tokens');
};

/**
 * PATCH /auth/tokens
 * 
 * refresh access_tokens
 * 
 * params:
 *      - cookie/body/both
 *      - refresh_token as cookie
 */
exports.update = function(req, res, next) {
    res.end('refresh tokens');
};

/**
 * log out
 */
exports.destroy = function(req,res, next) {
    res.end('log out');
};
