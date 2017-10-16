const KEYS = ['_endpoint', '_next'];


/**
 * @param obj       to be processed (in-place change)
 * @param apiBase
 * @return
 *      the paramter 'obj' itself
 */
function processOneObj(obj, apiBase) {
    Object.keys(obj).forEach((key) => {
        let val = obj[key]

        if (KEYS.includes(key) && val && !val.startsWith(apiBase)) {
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

    processOneObj(payload.data, req.baseUrl);
    return payload;
}
