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
        // unknown scope, don't give any authorization
        return [ ];
    }
}

/**
 * Note that order matters here, so more specific rules should go first. More
 * specific means path without things like `:notebookId`.
 * 
 * ## How it works:
 * Try to find a match from the `endpoints` array from start to end (order
 * matters here) by comparing the `path`. Once found a match, other endpoints
 * will by no means be considered. If the matched endpoint's methods contains
 * the client's current requesting method, then the request is okay.
 */
function toApiV1Endpoints(user) {
    const baseUrl = '/api/v1';
    const endpoints = [ ];
    const asGuest = user.username === 'guest';

    // use resources
    endpoints.push({
        methods: [ 'GET', 'PATCH', 'DELETE' ],
        path: `${baseUrl}/users/${user.id}`
    });
    endpoints.push({
        methods: asGuest ? [ 'GET', 'POST' ] : [ 'GET' ],
        path: `${baseUrl}/users`
    });
    endpoints.push({
        methods: [ 'GET' ],
        path: `${baseUrl}/users/:id`
    });

    // notebook resources
    endpoints.push({
        methods: [ 'GET', 'POST' ],
        path: `${baseUrl}/notebooks`
    });
    endpoints.push({
        methods: [ 'GET' ],
        path: `${baseUrl}/users/:userId/notebooks`
    });
    endpoints.push({
        methods: [ 'GET', 'PATCH', 'DELETE' ],
        path: `${baseUrl}/notebooks/:notebookId`
    });

    // section resources
    endpoints.push({
        methods: [ 'GET', 'POST' ],
        path: `${baseUrl}/notebooks/:notebookId/sections`
    });
    endpoints.push({
        methods: [ 'GET', 'PATCH', 'DELETE' ],
        path: `${baseUrl}/sections/:sectionId`
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
