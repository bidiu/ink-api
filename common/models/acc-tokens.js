const authUtils = require('../../utils/auth');

/** in bytes */
const JTI_LEN = 64;

/**
 * payload of access_token
 * 
 * @param {string} scope
 *      token scope, like '/api/v1'
 * @param {*} endpoints
 *      TODO
 */
function AccessToken(userId, asGuest, scope, endpoints) {
    this.jti = authUtils.genRandomStr(JTI_LEN);
    this.sub = userId;

    this.asGuest = asGuest;
    this.scope = scope;
    this.endpoints = endpoints;
}

AccessToken.prototype.getPlain = function() {
    return {
        jti: this.jti,
        sub: this.sub,
        asGuest: this.asGuest,
        scope: this.scope,
        endpoints: this.endpoints
    };
}

module.exports = AccessToken;
