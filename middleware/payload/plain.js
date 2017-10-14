const Sequlize = require('sequelize');


/**
 * Convert from Sequlize model instance to plain value object
 */
module.exports = function(payload, req) {
    if (!(payload.data instanceof Sequlize.Model)) { return payload; }

    payload.data = payload.data.get({ plain: true });
    return payload;
}
