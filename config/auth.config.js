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
    if (scope === '/api/v1') {
        return toApiV1Endpoints(user);
    } else {
        return [ ];
    }
}

/**
 * note that order matters here, so more specific rules should go first
 */
function toApiV1Endpoints(user) {
    const baseUrl = '/api/v1'
    const endpoints = [ ];

    // use resources
    endpoints.push({
        methods: [ 'GET', 'PATCH', 'DELETE' ],
        path: `${baseUrl}/users/${user.id}`
    });
    endpoints.push({
        methods: user.username === 'guest' ? [ 'GET', 'POST' ] : [ 'GET' ],
        path: `${baseUrl}/users`
    });
    endpoints.push({
        methods: [ 'GET' ],
        path: `${baseUrl}/users/:id`
    });

    return endpoints;
}


module.exports = {
    issuer: "https://inkbook.io",
    pubKeyFile: "ink_api_public.pem",
    privKeyFile: "ink_api_private.pem",
    hmacAlgo: 'sha512',
    jwtSignAlgo: 'RS512',
    refTokenExp: '90d',
    accTokenExp: '1h',
    eagerLoading: true,
    verifyScope,
    scopeToEndpoints
};
