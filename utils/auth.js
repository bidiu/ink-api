const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const ms = require('ms');
const appConfig = require('../config/app.config');
const authConfig = appConfig.authConfig;
const InkError = require('../common/models/ink-errors');
const codeDef = require('../common/custom-code');

// TODO move to config/auth
const HMAC_ALGO = authConfig.hmacAlgo || 'sha512';
const JWT_SIGN_ALGO = authConfig.jwtSignAlgo || 'RS512';
const REF_TOKEN_EXP = authConfig.refTokenExp || '30d';
const ACC_TOKEN_EXP = authConfig.accTokenExp || '1h';

/**
 * generates random string of characters, like salt
 * 
 * @param {number} len   in bytes
 */
function genRandomStr(len = 32) {
    return crypto.randomBytes(len).toString('hex');
};

/**
 * derive key from password (passwd)
 * 
 * @param {string} password 
 * @param {string} salt 
 * @param {number} iterations   optional
 * @param {number} keylen       optional, in bytes
 * @param {string} digest       optional
 * @return
 *      a promise resolve the derived key, or reject with any error
 */
function deriveKey(password, salt, { iterations = 100000, keylen = 64, digest = HMAC_ALGO } = {}) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, derivedKey) => {
            if (err) {
                // mostly, programming error
                reject(err);
            } else {
                resolve(derivedKey.toString('hex'));
            }
        });
    });
}

/**
 * Verify user-input password against saved salt and key.
 * If 'password' is undefined/null, verification always fails.
 * 
 * @param {string} password     user-input password (to verify)
 * @param {string} salt         saved salt
 * @param {string} key          saved key (hashed password)
 * @param {number} iterations   optional
 * @param {number} keylen       optional, in bytes
 * @param {string} digest       optional
 * @param {*}      toResolve    optional, will be resolved if verfification is passed
 * @return
 *      a promise, resolve with nothing when validation is passed, otherwise reject 
 *      with an InkError/programming error
 */
function verifyPasswd(password, salt, key, { iterations = 100000, keylen = 64, digest = HMAC_ALGO, toResolve } = {}) {
    return new Promise((resolve, reject) => {
        if (!password) {
            reject(new InkError.BadAuthentication({ details: 'You gave an incorrect password.', customCode: codeDef['WRONG_PASSWD'] }));
            return;
        }

        crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, derivedKey) => {
            if (err) {
                // mostly, programming error
                reject(err);
                return;
            }

            if (derivedKey.toString('hex') === key) {
                resolve(toResolve);
            } else {
                reject(new InkError.BadAuthentication({ details: 'You gave an incorrect password.', customCode: codeDef['WRONG_PASSWD'] }));
            }
        });
    });
}

/**
 * similar to verifyPasswd, except will resolve true/false to indicate
 * whether passowrd is verfied or not
 */
function comparePasswd(password, salt, key, iterations = 100000, keylen = 64, digest = HMAC_ALGO) {
    return new Promise((resolve, reject) => {
        if (!password) { reject(false); return; }

        crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, derivedKey) => {
            if (err) {
                // mostly, programming error
                reject(err);
            } else {
                resolve(derivedKey === key);
            }
        });
    });
}

const REF_TOKEN_SIGN_OPTIONS = {
    algorithm: JWT_SIGN_ALGO,
    expiresIn: REF_TOKEN_EXP,
    issuer: authConfig.issuer
};

/**
 * sign refresh_token
 * 
 * @param {}        payload 
 * @param {string}  privateKey 
 * @param {*}       options     (optional)
 *      mostly you don't need to take care of this, for more info, 
 *      see the `jsonwebtoken` doc
 */
function signRefToken(payload, privateKey, options) {
    options = Object.assign({}, REF_TOKEN_SIGN_OPTIONS, options);

    return new Promise((resolve, reject) => {
        jwt.sign(payload, privateKey, options, (err, token) => {
            if (err) {
                // TODO mostly, programming
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

const ACC_TOKEN_SIGN_OPTIONS = {
    algorithm: JWT_SIGN_ALGO,
    expiresIn: ACC_TOKEN_EXP,
    issuer: authConfig.issuer
};

/**
 * sign access_token
 * 
 * @param {*}       payload 
 * @param {string}  privateKey 
 * @param {*}       options (optional)
 *      mostly you don't need to take care of this, for more info, 
 *      see the `jsonwebtoken` doc
 */
function signAccToken(payload, privateKey, options) {
    options = Object.assign({}, ACC_TOKEN_SIGN_OPTIONS, options);

    return new Promise((resolve, reject) => {
        jwt.sign(payload, privateKey, options, (err, token) => {
            if (err) {
                // TODO mostly, programming error
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

const TOKEN_VERI_OPTIONS = {
    algorithm: JWT_SIGN_ALGO,
    issuer: authConfig.issuer,
    ignoreExpiration: false
};

/**
 * Verify a token (access or refresh token).
 * 
 * This is just a simple utility function (for instance, it won't
 * take into account the blacklist). For more fledged verification
 * against both access_token and refresh_token, please see functions
 * provided by auth servier.
 * 
 * @param {string}  token       null/undefined will fail the verification
 * @param {string}  type        token type: refresh_token/access_token
 * @param {string}  publicKey
 * @param {*}       options     (optional) See doc of jsonwebtoken
 * @return
 *      a promise resolve the JWT payload, or rejecting an error if 
 *      verifaication fails
 */
function verifyToken(token, type, publicKey, options) {
    options = Object.assign({}, TOKEN_VERI_OPTIONS, options);

    return new Promise((resolve, reject) => {
        jwt.verify(token, publicKey, options, (err, payload) => {
            if (err) {
                if (type === 'access_token') {
                    reject( new InkError.NoAuthorization({ details: 'You provided an invalid access token.' }) );
                } else {
                    reject( new InkError.BadAuthentication({ details: 'You provided an invalid refresh token.' }) );
                }
            } else {
                resolve(payload);
            }
        });
    });
}

/**
 * Decode the JWT token without verifying it. This is a thin
 * wrapper around the `jwt.decode` function.
 * 
 * Note that this is a synchronous operation.
 * 
 * @param {string} token    the JsonWebToken string
 * @return
 *      the decoded web token (only the payload part), or null if given
 *      token is malformed
 */
function decodeToken(token) {
    return jwt.decode(token);
}

/**
 * convert a refresh or access token to a cookie, if
 * `token.value` is `null/undefined`, then this utility
 * function will try to delete the cookie of it by
 * setting a expired date time
 * 
 * @param {*} token
 * @param {string} authPath
 *      typically '/auth'
 * @return
 *      [ cookie_name, cookie_value, { cookie_options } ]
 */
function toCookie(token, { authPath = '/auth' } = {}) {
    let maxAge = 0;
    if (token.value) {
        maxAge = token.type === 'refresh_token' ? ms(authConfig.refTokenExp) : ms(authConfig.accTokenExp);
    }

    return [token.type, token.value || '', {
        maxAge,
        path: token.type === 'refresh_token' ? authPath : token.scope,
        secure: appConfig.env === 'production',
        httpOnly: true
    }];
}

/**
 * Mask cookie's value. Name and all options will be preserved.
 * Note that it will return a new copy (won't change the given
 * cookie).
 * 
 * You can also provide a optional option object. Options within
 * this object will override options in the given cookie.
 * 
 * @param {Array} cookie 
 *          [name, value, { options }]
 * @param {string} suffix
 *          suffix of cookie name, such as `_copy`
 * @param {*} options
 *          optional options that take precedence
 * @return
 *          a copy of the given cookie with value masked 
 */
function maskCookie(cookie, suffix, options = {}) {
    return [cookie[0] + suffix, '', { ...cookie[2], ...options }];
}

/**
 * @param {*} instance 
 *      model instance (could also be plain)
 * @param {*} sub 
 *      user id (the user who are requesting the resource server)
 * @return
 *      return nothing
 */
function verifyOwner(instance, sub) {
    if (sub && typeof sub === 'object') { sub = sub.sub; }
    let owner = instance.userId || instance.owner;
    if (typeof owner !== 'number' || typeof sub !== 'number' || owner !== sub) {
        throw new InkError.NoAuthorization();
    }
}

/**
 * Similar to `verifyOwner`, but won't throw any error
 * 
 * @param {*} instance 
 * @param {*} sub 
 * @return
 *      true if verification passes, otherwise false
 */
function compareOwner(instance, sub) {
    try {
        verifyOwner(instance, sub);
        return true;
    } catch(err) {
        if (! (err instanceof InkError.NoAuthorization)) { throw err; }
        return false;
    }
}

exports.genRandomStr = genRandomStr;
exports.genSalt = genRandomStr;
exports.deriveKey = deriveKey;
exports.verifyPasswd = verifyPasswd;
exports.comparePasswd = comparePasswd;
exports.signAccToken = signAccToken;
exports.signRefToken = signRefToken;
exports.verifyToken = verifyToken;
exports.decodeToken = decodeToken;
exports.toCookie = toCookie;
exports.maskCookie = maskCookie;
exports.verifyOwner = verifyOwner;
exports.compareOwner = compareOwner;
