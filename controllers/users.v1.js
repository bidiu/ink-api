const userService = require('../services/users.v1');
const Res = require('../common/models/responses');
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
    let id = req.params.id;
    let _fields = commonUtils.arrayWrap(req.query._fields);

    userService.retrieve(id, { _fields: _fields })
            .then((retrieved) => {
                let payload = new Res.Ok({ data: retrieved });
                res.status(payload.status).json(payload);
            })
            .catch((err) => {
                next(err);
            });
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
    let params = req.body;
    let _fields = commonUtils.arrayWrap(params._fields);

    userService.create(params, { _fields: _fields })
            .then((saved) => {
                let payload = new Res.Ok({ data: saved });
                res.status(payload.status).json(payload);
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
