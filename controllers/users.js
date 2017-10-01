const User = require('../models/users');


/**
 * GET /users
 */
exports.list = function(req, res) {
    res.end('list all users here');
}
