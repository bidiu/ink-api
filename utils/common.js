/**
 * Notes:
 *      1. null         => undefined
 *      2. undefined    => undefined
 *      3. 1            => [ 1 ]
 *      4. [ 1 ]        => [ 1 ]
 */
exports.arrayWrap = function(val) {
    if (val === null || val === undefined) {
        return undefined;
    } else {
        return val instanceof Array ? val : [val];
    }
}

/**
 * Deprecated.
 * From '/api/v1/users' to '/api/v1'
 */
exports.apiBase = function(url) {
    // TODO right now for simplicity, just hardcoded
    return '/api/v1';
}

/**
 * Note that this is only shallow copy.
 */
exports.copyParams = function(params, over = {}) {
    return Object.assign({}, params, over);
}
