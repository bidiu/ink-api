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
    let params = {
        id: req.params.id,
        _fields: commonUtils.arrayWrap(req.query._fields) || '*'
    };

    userService.retrieve(params)
            .then((retrieved) => {
                if (retrieved) {
                    let ack = new Ack(retrieved);
                    res.status(ack.status).json(ack);
                    return;
                }
                next(Err.NotFound);
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
    params._fields = commonUtils.arrayWrap(params._fields) || '*';

    userService.create(params)
            .then((saved) => {
                let ack = new Ack(saved || undefined);
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
