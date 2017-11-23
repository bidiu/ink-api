const userService = require('../users.v1');
const authUtils = require('../../utils/auth');
const appConfig = require('../../config/app.config');
const RefreshToken = require('../../common/models/ref-tokens');
const InkError = require('../../common/models/ink-errors');

const NONEXIST_CREDENTIAL_DETAILS = 'The login credential (username/email) you are using doesn\'t exist.';

/**
 * Verify user login credential
 * 
 * TODO in transaction
 * 
 * @param {string} username
 *      could be username or email address
 * @param {string} password
 * @param {number} userId
 *      (optional) if given, the credential has to belong to the user id
 * @return 
 *      A promise resolve a user instance (sanitized under retrieval situation),
 *      or reject with a InkError.BadAuthentication error.
 */
function _verifyCredential(username, password, userId) {
    return userService.retrieveV2({ username, sanitize: false })
            .then((retrieved) => {
                if (userId && retrieved.id !== userId) {
                    // crendetial given doesn't match the user id
                    throw new InkError.BadAuthentication({ details: 'You gave a wrong login crendential.' });
                }

                return authUtils.verifyPasswd(password, retrieved.salt, retrieved.password, {
                    toResolve: retrieved
                });
            }, (err) => {
                if (err instanceof InkError.NotFound) {
                    // credential provided by user doesn't exist
                    throw new InkError.BadAuthentication({ details: NONEXIST_CREDENTIAL_DETAILS });
                }
                // programming error
                throw err;
            })
            .then((verified) => {
                // sanitize fields, like 'password' and 'salt'
                return userService.retrieve(verified.id);
            });
}

const REF_VERI_OPTIONS = {
    rev: true
};

/**
 * will return a new object
 */
function _mapTokenVeriOptions({ alg, exp, iss, rev } = {}) {
    let options = { ignoreRevocation: !REF_VERI_OPTIONS.rev };
    if (alg !== undefined) { options.algorithm = alg; }
    if (exp !== undefined) { options.ignoreExpiration = !exp; }
    if (iss !== undefined) { options.issuer = iss; }
    if (rev !== undefined) { options.ignoreRevocation = !rev; }
    return options;
}

/**
 * Verify refresh token, built on top of 'authUtils.verifyToken', 
 * with simpilfied version of options.
 * 
 * Since built on top of 'authUtils.verifyToken', undefined/null 
 * refresh_token will always fail the verification.
 * 
 * @param {string} refToken the refresh token to verify
 * @param {string} publicKey
 * @param {*} options (optional)
 *      alg {string}        (optional) algorithm to use, for default value, see 'auth utils'
 *      exp {boolean}       (optional) whether to verify exp, for default, see 'auth utils'
 *      iss {string}        (optional) the issuer, for default value, see 'auth utils'
 *      rev {boolean}       (optional) whether to consider revocation list, default 'true'
 * @return
 *      a promise, resolving the payload, or, in case the verification fails, rejecting with
 *      a BadAuthentication error
 */
function _verifyRefToken(refToken, publicKey, options) {
    options = _mapTokenVeriOptions( Object.assign({}, REF_VERI_OPTIONS, options) );

    return authUtils.verifyToken(refToken, publicKey, options);
}

/**
 * generate a refresh token
 * 
 * @param {Array<string>} scopes 
 *      requested scopes, such as '/api/v1'
 * @param {User} user 
 *      user requesting the scope, might be the special guest user
 * @param {*} options (optional)
 *      see `authUtils.signRefToken()`
 * @return
 *      a promise
 */
function _genRefToken(scopes, user, options) {
    // TODO
    let payload = new RefreshToken(user.id, false, scopes).getPlain();

    return authUtils.signRefToken(payload, appConfig.privateKey, options)
            .then((token) => {
                return {
                    type: 'refresh_token',
                    value: token,
                    scopes: scopes 
                };
            });
}

/**
 * generate a access_token corresponding to the given scope
 * 
 * @param {string} scope
 *      typically like '/api/v1'
 * @param {User} user
 *      user requesting the scope, might be the special guest user
 * @param {*} options (optional)
 *      see `authUtils.signAccToken()`
 * @return
 *      a promise
 */
function _genAccToken(scope, user, options) {
    // TODO
    return authUtils.signAccToken({}, appConfig.privateKey, options)
            .then((token) => {
                return {
                    type: 'access_token',
                    value: token,
                    scope: scope
                };
            });
}

/**
 * facade service for 'create' on auth controller
 * 
 * @param {Array<string>} scopes
 *      requested scopes, typically only has one string, like '/api/v1'
 * @param {*} options username/password is optional when asGuest is set true
 *      username        (optional) could be email address as well
 *      password        (optional)
 *      asGuest         (optional) boolean, default false
 *      refToken        (optianal) refresh token
 * @return
 *      a promise resolve a list of cookies, like:
 * 
 *          [ 
 *              ['refresh_token', 'abcdef...', { maxAge: 10000 }],
 *              ['access_token', 'abcdefg...', { maxAge: 1000 }],
 *              ...
 *          ]
 * 
 *      or resolve an error that first occurs during token generation
 */
function create(scopes, { username, password, asGuest = false, refToken } = {}) {
    if (!scopes) { throw new InkError.BadReq({ message: '\'scopes\' must be provided.' }); }

    return _verifyRefToken(refToken, appConfig.publicKey)
            .then((payload) => {
                return _relogin(scopes, payload, { username, password, asGuest });
            }, (err) => {
                return _login(scopes, username, password, asGuest);
            });
};

/**
 * TODO Consider guest situation:
 *  - allow login from guest status
 *  - disallow login to guest from any other user account
 * 
 * @param scopes        MUST be post-santized
 * @param payload 
 * @param options
 * @return
 *      see 'create' above
 */
function _relogin(scopes, payload, { username, password, asGuest = false } = {}) {
    if (asGuest) {
        // TODO
    } else {
        return _verifyCredential(username, password, payload.sub)
                .then((user) => {
                    return Promise.all(
                        [ _genRefToken(scopes, user) ].concat(scopes.map((s) => _genAccToken(s, user)))
                    );
                });
    }
}

/**
 * Similar to 'create' method above, but here this method is executed when no valid 
 * refToken is present (either expires or in blacklist). Call this method only it 
 * conforms to just mentioned situation. If you aren't sure, always call 'create'.
 * 
 * @param scopes        MUST be post-santized
 * @param username
 * @param password
 * @param asGuest       if set true, username and password will be ignored
 * @return
 *      see 'create' above
 */
function _login(scopes, username, password, asGuest = false) {
    return (asGuest ? userService.retrieveGuest() : _verifyCredential(username, password))
            .then((user) => {
                return Promise.all(
                    [ _genRefToken(scopes, user) ].concat(scopes.map((s) => _genAccToken(s, user)))
                );
            });
}

/**
 * facade service for 'update' on auth controller
 */
function update() {

}

/**
 * facade service for 'destroy' on auth controller
 * note that it's safe to call this many times
 * 
 * @param {string} refToken the refresh token
 * @return
 *      a promise resolving tokens (including refresh and access tokens),
 *      which could be converted to cookies to invalidate client's cookies
 */
function destroy(refToken) {
    if (!refToken) { return Promise.resolve([ ]); } // already logged out

    return _verifyRefToken(refToken, appConfig.publicKey, { exp: false, rev: false })
            .then((payload) => {
                return [{ type: 'refresh_token', value: null, scopes: payload.scopes }]
                        .concat(payload.scopes.map((scope) => {
                            return { type: 'access_token', value: null, scope };
                        }));
            });
}

exports.create = create;
exports.update = update;
exports.destroy = destroy;
