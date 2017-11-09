/**
 * Notes:
 *      1. null         => undefined
 *      2. undefined    => undefined
 *      3. 1            => [ 1 ]
 *      4. [ 1 ]        => [ 1 ]
 */
function arrayWrap(val) {
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
function apiBase(url) {
    // TODO right now for simplicity, just hardcoded
    return '/api/v1';
}

/**
 * Note that this is only shallow copy.
 */
function copyParams(params, over = {}) {
    return Object.assign({}, params, over);
}


exports.arrayWrap = arrayWrap;
exports.apiBase = apiBase;
exports.copyParams = copyParams;
