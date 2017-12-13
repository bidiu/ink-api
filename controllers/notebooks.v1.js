const notebookService = require('../services/notebooks.v1');
const Res = require('../common/models/responses');
const processPayload = require('../middleware/payload/payload');

/**
 * GET /users/:userId/notebooks
 */
exports.index = async function(req, res, next) {
    let userId = +req.params.userId;
    let params = req.query;

    let data = await notebookService.index(userId, { params });
    let payload = await processPayload(new Res.Ok({ data }), req);
    res.status(payload.status).json(payload);
}

/**
 * GET /notebooks/:notebookId
 */
exports.retrieve = async function(req, res, next) {
    let notebookId = +req.params.notebookId;

    let data = await notebookService.retrieve(notebookId);
    let payload = await processPayload(new Res.Ok({ data }), req);
    res.status(payload.status).json(payload);
}

/**
 * POST /notebooks
 */
exports.create = async function(req, res, next) {
    let params = req.body;
    let auth = req.auth;

    let data = await notebookService.create(params, auth);
    let payload = await processPayload(new Res.Ok({ data }), req);
    res.status(payload.status).json(payload);
}

/**
 * PATCH /notebooks/:notebookId
 */
exports.update = async function(req, res, next) {
    let notebookId = +req.params.notebookId;
    let params = req.body;

    let data = await notebookService.update(notebookId, params);
    let payload = await processPayload(new Res.Ok({ data }), req);
    res.status(payload.status).json(payload);
}

/**
 * DELETE /notebooks/:notebookId
 */
exports.destroy = async function(req, res, next) {
    let notebookId = +req.params.notebookId;

    await notebookService.destroy(notebookId);
    let payload = await processPayload(new Res.Ok(), req);
    res.status(payload.status).json(payload);
}
