const userService = require('../services/users.v1');
const Res = require('../common/models/responses');


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

    userService.retrieve(id)
            .then((retrieved) => {
                let payload = new Res.Ok({ data: retrieved });
                res.status(payload.status).json(payload);
            })
            .catch((err) => {
                next(err);
            });
}

/**
 * POST /users (non-idempotent)
 * 
 * Create a new user.
 */
exports.create = function(req, res, next) {
    let params = req.body;

    userService.create(params)
            .then((created) => {
                let payload = new Res.Ok({ data: created });
                res.status(payload.status).json(payload);
            })
            .catch((err) => {
                next(err);
            });
}

/**
 * PATCH /users/1 (idempotent)
 * 
 * update a existing user (could be partially update)
 */
exports.update = function(req, res, next) {
    let id = req.params.id;
    let params = req.body;

    userService.update(id, params)
            .then((updated) => {
                let payload = new Res.Ok({ data: updated });
                res.status(payload.status).json(payload);
            })
            .catch((err) => {
                next(err);
            });
}

/**
 * DELETE /users/1 (idempotent)
 */
exports.destroy = function(req, res, next) {
    let id = req.params.id;

    userService.destroy(id)
            .then(() => {
                let payload = new Res.Ok();
                res.status(payload.status).json(payload);
            })
            .catch((err) => {
                next(err);
            });
}
