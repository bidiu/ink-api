const userService = require('../services/users.v1');
const Res = require('../common/models/responses');
const processPayload = require('../middleware/payload/payload');


/**
 * GET /users
 */
exports.index = function(req, res, next) {
    let params = req.query;

    userService.index({ params: params })
            .then((indexed) => {
                let payload = new Res.Ok({ data: indexed });
                payload = processPayload(payload, req);
                res.status(payload.status).json(payload);
            })
            .catch((err) => {
                next(err);
            });
}

/**
 * GET /users/1
 */
exports.retrieve = function(req, res, next) {
    let id = req.params.id;
    let params = req.query;

    userService.retrieve(id, { params: params })
            .then((retrieved) => {
                let payload = new Res.Ok({ data: retrieved });
                payload = processPayload(payload, req);
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
                payload = processPayload(payload, req);
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
                payload = processPayload(payload, req);
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
                payload = processPayload(payload, req);
                res.status(payload.status).json(payload);
            })
            .catch((err) => {
                next(err);
            });
}
