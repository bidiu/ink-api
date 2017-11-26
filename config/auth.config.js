const SCOPES = [ '/api/v1' ]

/**
 * @param {string} scope 
 * @param {*} user
 * @return a boolean indicating whether the scope is valid
 */
function verifyScope(scope, user) {
    return SCOPES.includes(scope);
}

/**
 * @param {string} scope 
 * @param {*} user
 * @return 
 *      an array of objects which represents a list of authorized endpoints 
 *      inside the given scope: 
 * 
 *          [ { methods: [ 'GET' ], path: '/api/v1/users/123' }, ... ]
 */
function scopeToEndpoints(scope, user) {
    return [{
        methods: [ 'GET' ],
        path: '/api/v1/users/1007'
    }];
}


module.exports = {
    issuer: "https://inkbook.io",
    pubKeyFile: "ink_api_public.pem",
    privKeyFile: "ink_api_private.pem",
    hmacAlgo: 'sha512',
    jwtSignAlgo: 'RS512',
    refTokenExp: '90d',
    accTokenExp: '1h',
    verifyScope,
    scopeToEndpoints
};
