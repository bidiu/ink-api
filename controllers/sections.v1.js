const sectionService = require('../services/sections.v1');
const Res = require('../common/models/responses');
const processPayload = require('../middleware/payload/payload');

/**
 * GET /notebooks/:notebookId/sections
 */
exports.index = function(req, res, next) {
    res.end('index');
}

/**
 * GET /sections/:sectionId
 */
exports.retrieve = function(req, res, next) {
    let sectionId = req.params.sectionId;

    sectionService.retrieve(sectionId)
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
 * POST /notebooks/:notebookId/sections
 */
exports.create = function(req, res, next) {
    let params = req.body;
    let notebookId = req.params.notebookId;
    let auth = req.auth;

    sectionService.create(params, notebookId, auth)
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
 * PATCH /sections/:sectionId
 */
exports.update = function(req, res, next) {
    res.end('update');
}

/**
 * DELETE /sections/:sectionId
 */
exports.destroy = function(req, res, next) {
    res.end('destroy');
}
