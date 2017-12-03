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
 * specific means path without keys like `:notebookId`.
 * 
 * ## How it works
 * Here, try to find a match from the `endpoints` array from start to end (order
 * matters here) by comparing the `path`. Once found a match, other endpoints
 * will by no means be considered. If the matched endpoint's `methods` contains
 * the client's current requesting method, then the request is okay. But if 
 * `exec` is given for the matched endpoint, yet another test against `exec` 
 * will also be performed - see next).
 * 
 * ## Use `exec` field
 * Any key in the `path` (such as `:sectionId`) could also be further verified
 * in terms of ownership. One of the premises of this verification is that key
 * verified against must be a primary key of a model supporting ownership. You 
 * would use `exec.model` to indicate which model the primary key belongs to:
 * ```
 * [{
 *     key: 'sectionId',
 *     model: 'sections'
 * }, {
 *     // supports verifying multiple keys in the `path`
 *     // ...
 * }]
 * ```
 * 
 * > A model supporting owner ship is one whose table has either `userId` or 
 * `owner` field (or both but with same value).
 * 
 * The verification will pass if, for all `exec.key`s, the model instance retrieved 
 * with `exec.key` and `exec.model` belongs to the holder of the access token.
 * 
 * > **IMPORTANT** Because the fact that the auth infrastructure supports ownership
 * verification (authorization built into JWT), you MUST always use simple form of 
 * `named keys` (such as `:sectionId`) in your router definition. Simple form means
 * the regular thing you would do like `/sections/:sectionId`. On the other hand, 
 * complicated form (you must **NOT** use) is ones include advanced features like 
 * optional keys, such as `/sections/:sectionId+` (you must **NOT** use this).
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
        methods: [ 'POST' ],
        path: `${baseUrl}/notebooks`
    });
    endpoints.push({
        methods: [ 'GET' ],
        path: `${baseUrl}/users/${user.id}/notebooks`
    });
    endpoints.push({
        methods: [ 'GET', 'PATCH', 'DELETE' ],
        path: `${baseUrl}/notebooks/:notebookId`,
        exec: [{ key: 'notebookId', model: 'notebooks' }]
    });

    // section resources
    endpoints.push({
        methods: [ 'GET', 'POST' ],
        path: `${baseUrl}/notebooks/:notebookId/sections`,
        exec: [{ key: 'notebookId', model: 'notebooks' }]
    });
    endpoints.push({
        methods: [ 'GET', 'PATCH', 'DELETE' ],
        path: `${baseUrl}/sections/:sectionId`,
        exec: [{ key: 'sectionId', model: 'sections' }]
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
