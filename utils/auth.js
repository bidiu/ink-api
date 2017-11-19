const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/app.config').authConfig;
const InkError = require('../common/models/ink-errors');

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
            reject(new InkError.BadAuthentication({ details: 'You gave an incorrect password.' }));
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
                reject(new InkError.BadAuthentication({ details: 'You gave an incorrect password.' }));
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
    issuer: 'https://inkbook.io'
};

/**
 * sign refresh_token
 * 
 * @param {}        payload 
 * @param {string}  privateKey 
 * @param {*}       options     (optional) mostly you don't need this
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
    issuer: 'https://inkbook.io'
};

/**
 * sign access_token
 * 
 * @param {*}       payload 
 * @param {string}  privateKey 
 * @param {*}       options     (optional) mostly you don't need this
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
    issuer: 'https://inkbook.io',
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
 * @param {string}  publicKey 
 * @param {*}       options     (optional) See doc of jsonwebtoken
 * @return
 *      a promise resolve the JWT payload, or rejecting an error if 
 *      verifaication fails
 */
function verifyToken(token, publicKey, options) {
    options = Object.assign({}, TOKEN_VERI_OPTIONS, options);

    return new Promise((resolve, reject) => {
        jwt.verify(token, publicKey, options, (err, payload) => {
            if (err) {
                reject(new InkError.BadAuthentication({ details: 'You provided an invalid token.' }));
            } else {
                resolve(payload);
            }
        });
    });
}

/**
 * convert a refresh or access token to a cookie
 * 
 * @param {*} token
 * @param {string} authPath
 *      typically '/auth'
 * @return
 *      [ cookie_name, cookie_value, { cookie_options } ]
 */
function toCookie(token, authPath) {
    return [token.type, token.value, {
        maxAge: token.type === 'refresh_token' ? ms(authConfig.refTokenExp) : ms(authConfig.accTokenExp),
        path: token.type === 'refresh_token' ? authPath : token.scope,
        secure: true,
        httpOnly: true
    }];
}

exports.genRandomStr = genRandomStr;
exports.genSalt = genRandomStr;
exports.deriveKey = deriveKey;
exports.verifyPasswd = verifyPasswd;
exports.comparePasswd = comparePasswd;
exports.signAccToken = signAccToken;
exports.signRefToken = signRefToken;
exports.verifyToken = verifyToken;
exports.toCookie = toCookie;
