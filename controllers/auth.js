/**
 * POST /auth/tokens
 * 
 * log in (or as guest): acquire a new access_token and several refresh_tokens
 * 
 * TODO what if already logged in?
 * 
 * params: 
 *      - username/email + password
 *      - asGuest?
 *      - scopes
 *      - cookie/body/both
 */
exports.create = function(req, res, next) {
    res.end('gen tokens');
};

/**
 * PATCH /auth/tokens
 * 
 * params:
 *      - refresh_token
 *      - cookie/body/both
 */
exports.update = function(req, res, next) {
    res.end('refresh tokens');
};
