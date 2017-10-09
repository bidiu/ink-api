const userService = require('../services/users.v1');
const Ack = require('../common/ack');
const Err = require('../common/err');
const commonUtils = require('../utils/common');


/**
 * GET /users
 */
exports.index = function(req, res, next) {
    res.end('index');
}

/**
 * GET /users/1
 */
exports.retrieve = function(req, res, next) {
    res.end('retrieve');
}

/**
 * Create a new user.
 * 
 * POST /users (non-idempotent)
 * 
 * Additional params:
 *      _fields
 */
exports.create = function(req, res, next) {
    let body = req.body;
    body._fields = commonUtils.arrayWrap(body._fields) || '*';

    userService.create(req.body)
            .then((saved) => {
                let ack = new Ack('User was created successfully.', saved);
                res.status(ack.status).json(ack);
            })
            .catch((err) => {
                next(err);
            });
}

/**
 * PATCH /users/1   (idempotent)
 * 
 * update a existing user (could be partially update)
 */
exports.update = function(req, res, next) {
    res.end('update');
}

/**
 * DELETE /users/1  (idempotent)
 */
exports.destroy = function(req, res, next) {
    res.end('destroy');
}
