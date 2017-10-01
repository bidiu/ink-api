const User = require('../models/users');


/**
 * GET /users
 */
exports.index = function(req, res) {
    res.end('index');
}

/**
 * GET /users/1
 */
exports.retrieve = function(req, res) {
    res.end('retrieve');
}

/**
 * POST /users      (non-idempotent)
 * 
 * create a new user
 */
exports.create = function(req, res) {
    res.end('create');
}

/**
 * PATCH /users/1   (idempotent)
 * 
 * update a existing user (could be partially update)
 */
exports.update = function(req, res) {
    res.end('update');
}

/**
 * DELETE /users/1  (idempotent)
 */
exports.destroy = function(req, res) {
    res.end('destroy');
}
