const util = require('util');
const exec = util.promisify(require('child_process').exec);
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
 * Only support JavaScript, put the script in `scripts` directory,
 * 
 * Note that the script will run in a separate node process, so 
 * calling this function will bring somewhat performance overhead.
 * And also note that this is an async function.
 * 
 * Also note that `node` must be in the PATH of the running OS (docker
 * container). The shell used is sh.
 * 
 * Last, keep in mind that because script is run in a separate process,
 * dead lock would be possible on database if you are careless.
 * 
 * @param {string} script 
 *      the script's filename, without extention (.js)
 * @return
 *      a promise, for resolve what, refer to the doc of 
 *      `child_process.exec()`
 */
function execScript(script) {
    return exec(`node ./${script}.js`, {
        cwd: path.join(__dirname, '..', 'scripts')
    });
}

exports.arrayWrap = arrayWrap;
exports.apiBase = apiBase;
exports.copyParams = copyParams;
exports.execScript = execScript;
