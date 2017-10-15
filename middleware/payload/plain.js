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
    } else if (obj instanceof Array) {
        Object.keys(obj).forEach((i) => {
            obj[i] = plainOneObj(obj[i]);
        });
        return obj;
    } else {
        // don't know how to plain
        return obj;
    }
}

/**
 * Convert from Sequlize model instance to plain value object
 */
module.exports = function(payload, req) {
    if (!(payload.data instanceof Sequlize.Model) && !(payload.data instanceof Array)) {
        // don't know how to process
        return payload;
    }

    payload.data = plainOneObj(payload.data);
    return payload;
}
