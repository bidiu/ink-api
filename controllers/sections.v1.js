const sectionService = require('../services/sections.v1');
const Res = require('../common/models/responses');
const processPayload = require('../middleware/payload/payload');

/**
 * GET /notebooks/:notebookId/sections
 */
exports.index = async function(req, res, next) {
    let notebookId = +req.params.notebookId;
    let auth = req.auth;
    let params = req.query;

    let data = await sectionService.index(notebookId, auth, { params });
    let payload = await processPayload(new Res.Ok({ data }), req);
    res.status(payload.status).json(payload);
}

/**
 * GET /sections/:sectionId
 */
exports.retrieve = async function(req, res, next) {
    let sectionId = +req.params.sectionId;

    let data = await sectionService.retrieve(sectionId);
    let payload = await processPayload(new Res.Ok({ data }), req);
    res.status(payload.status).json(payload);
}

/**
 * POST /notebooks/:notebookId/sections
 */
exports.create = async function(req, res, next) {
    let params = req.body;
    let notebookId = +req.params.notebookId;
    let auth = req.auth;

    let data = await sectionService.create(params, notebookId, auth);
    let payload = await processPayload(new Res.Ok({ data }), req);
    res.status(payload.status).json(payload);
}

/**
 * PATCH /sections/:sectionId
 */
exports.update = async function(req, res, next) {
    res.end('update');
}

/**
 * DELETE /sections/:sectionId
 */
exports.destroy = async function(req, res, next) {
    res.end('destroy');
}
