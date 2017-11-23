const { execSync } = require('child_process');
const path = require('path');

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

/**
 * only support JavaScript, put the script in `script`
 * directory
 * 
 * @param {*} script 
 * @param {*} options
 */
function execScript(script, { child = true } = {}) {
    if (child) {
        return execSync(`node ./${script}.js`, {
            cwd: path.join(__dirname, '..', 'scripts'),
            stdio: 'inherit'
        });
    } else {
        require(`../scripts/${script}`);
    }
}

exports.arrayWrap = arrayWrap;
exports.apiBase = apiBase;
exports.copyParams = copyParams;
exports.execScript = execScript;
