const KEYS = ['_endpoint', '_next', '_prev', '_first', '_last'];


function prepend(str, baseUrl, path) {
    if (str.startsWith('/')) {
        return baseUrl + str;
    } else if (str.startsWith('?')) {
        return baseUrl + path + str;
    } else {
        // don't know how to process
        return str;
    }
}

/**
 * @param obj       to be processed (in-place change)
 * @param apiBase
 * @return
 *      the paramter 'obj' itself
 */
function processOneObj(obj, { baseUrl, path }) {
    Object.keys(obj).forEach((key) => {
        let val = obj[key]

        if (KEYS.includes(key) && val && !val.startsWith(baseUrl)) {
            obj[key] = prepend(val, baseUrl, path);
        } else if (val && typeof val === 'object') {
            obj[key] = processOneObj(val, { baseUrl: baseUrl, path: path });
        }
    });
    return obj;
}


/**
 * 
 */
module.exports = function(payload, req) {
    if (!payload.data) { return payload; }

    processOneObj(payload.data, req);
    return payload;
}
