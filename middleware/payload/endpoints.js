const commonUtils = require('../../utils/common');


const KEY_ENDPOINT = '_endpoint';


/**
 * @param {*} obj       to be processed (in-place change)
 * @param {*} apiBase 
 */
function processOneObj(obj, apiBase) {
    Object.keys(obj).forEach((key) => {
        let val = obj[key]

        if (key === KEY_ENDPOINT) {
            obj[key] = apiBase + val;
        } else if (val && typeof val === 'object') {
            obj[key] = processOneObj(val, apiBase);
        }
    });
    return obj;
}


/**
 * 
 */
module.exports = function(payload, req) {
    if (!payload.data) { return payload; }

    processOneObj(payload.data, commonUtils.apiBase(req.originalUrl));
    return payload;
}
