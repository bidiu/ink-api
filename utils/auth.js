const crypto = require('crypto');
const InkError = require('../common/models/ink-errors');


const HMAC_ALGO = 'sha512';

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
 * verify user-input password against saved salt and key
 * 
 * @param {string} password     user-input password
 * @param {string} salt         saved salt
 * @param {string} key          saved key
 * @param {number} iterations   optional
 * @param {number} keylen       optional, in bytes
 * @param {string} digest       optional
 * @return
 *      a promise, resolve with nothing when validation is passed, 
 *      otherwise reject with an InkError/programming error
 */
function verifyPasswd(password, salt, key, { iterations = 100000, keylen = 64, digest = HMAC_ALGO } = {}) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, derivedKey) => {
            if (err) {
                // mostly, programming error
                reject(err);
                return;
            }

            if (derivedKey.toString('hex') === key) {
                resolve();
            } else {
                reject(new InkError.BadAuthentication());
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


exports.genRandomStr = genRandomStr;
exports.genSalt = genRandomStr;
exports.deriveKey = deriveKey;
exports.comparePasswd = comparePasswd;
