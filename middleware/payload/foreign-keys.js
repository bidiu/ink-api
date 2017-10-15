const FK_SUFFIX = 'Id';


/**
 * @param {*} obj       to be processed (in-place change)
 * @param {*} apiBase 
 */
function processOneObj(obj) {
    Object.keys(obj).forEach((key) => {
        let val = obj[key]

        if (key.endsWith(FK_SUFFIX)) {
            delete obj[key];
        } else if (val && typeof val === 'object') {
            obj[key] = processOneObj(val);
        }
    });
    return obj;
}


/**
 * 
 */
module.exports = function(payload, req) {
    if (!payload.data) { return payload; }

    processOneObj(payload.data);
    return payload;
}
