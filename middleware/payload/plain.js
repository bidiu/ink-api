const Sequlize = require('sequelize');


/**
 * Note:
 *      This won't change the paramter 'obj', instead, return a new
 *      one, which is the plain version (plain JSON) of the model
 *      instance.
 * @return
 *      Please see notes.
 */
function plainOneObj(obj) {
    if (obj instanceof Sequlize.Model) {
        return obj.get({ plain: true });
    } else if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach((k) => {
            obj[k] = plainOneObj(obj[k]);
        });
        return obj;
    } else {
        // null, undefined or other types which can't be plained
        return obj;
    }
}

/**
 * Convert from Sequlize model instance to plain value object
 */
module.exports = function(payload, req) {
    if (!payload.data) { return payload; }

    payload.data = plainOneObj(payload.data);
    return payload;
}
