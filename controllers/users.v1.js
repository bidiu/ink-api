const userService = require('../services/users.v1');
const Res = require('../common/models/responses');
const processPayload = require('../middleware/payload/payload');

/**
 * GET /users
 */
exports.index = async function(req, res, next) {
    let auth = req.auth;
    let params = req.query;

    let data = await userService.index(auth, { params });
    let payload = await processPayload(new Res.Ok({ data }), req);
    res.status(payload.status).json(payload);
}

/**
 * GET /users/1
 */
exports.retrieve = async function(req, res, next) {
    let id = +req.params.id;
    let params = req.query;

    let data = await userService.retrieve(id, { params });
    let payload = await processPayload(new Res.Ok({ data }), req);
    res.status(payload.status).json(payload);
}

/**
 * POST /users (non-idempotent)
 * 
 * Create a new user.
 */
exports.create = async function(req, res, next) {
    let params = req.body;

    let data = await userService.create(params);
    let payload = await processPayload(new Res.Ok({ data }), req);
    res.status(payload.status).json(payload);
}

/**
 * PATCH /users/1 (idempotent)
 * 
 * update a existing user (could be partially update)
 */
exports.update = async function(req, res, next) {
    let id = +req.params.id;
    let params = req.body;

    let data = await userService.update(id, params);
    let payload = await processPayload(new Res.Ok({ data }), req);
    res.status(payload.status).json(payload);
}

/**
 * DELETE /users/1 (idempotent)
 */
exports.destroy = async function(req, res, next) {
    let id = +req.params.id;

    await userService.destroy(id);
    let payload = await processPayload(new Res.Ok(), req);
    res.status(payload.status).json(payload);
}
