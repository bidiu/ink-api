const authUtils = require('../../utils/auth');

/** in bytes */
const JTI_LEN = 64;

/**
 * payload of refresh_token
 * 
 * @param {*} userId 
 * @param {*} asGuest 
 * @param {*} scopes 
 */
function RefreshToken(userId, asGuest, scopes) {
    this.jti = authUtils.genRandomStr(JTI_LEN);
    this.sub = userId;

    this.asGuest = asGuest;
    this.scopes = scopes;
}

RefreshToken.prototype.getPlain = function() {
    return {
        jti: this.jti,
        sub: this.sub,
        asGuest: this.asGuest,
        scopes: this.scopes
    };
}

module.exports = RefreshToken;
