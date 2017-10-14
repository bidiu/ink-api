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
 * From '/api/v1/users' to '/api/v1'
 */
exports.apiBase = function(url) {
    // TODO right now for simplicity, just hardcoded
    return '/api/v1';
}
