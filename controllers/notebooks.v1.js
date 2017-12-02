const notebookService = require('../services/notebooks.v1');
const Res = require('../common/models/responses');
const processPayload = require('../middleware/payload/payload');


/**
 * GET /users/:userId/notebooks
 * GET /notebooks
 */
exports.index = function(req, res, next) {
    let auth = req.auth;
    let userId = req.params.userId; // might be undefined
    let params = req.query;

    notebookService.index(auth, { userId, params })
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
 * GET /notebooks/:notebookId
 */
exports.retrieve = function(req, res, next) {
    let notebookId = req.params.notebookId;
    let auth = req.auth;

    notebookService.retrieve(notebookId, auth)
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
 * POST /notebooks
 */
exports.create = function(req, res, next) {
    let params = req.body;
    let auth = req.auth;

    notebookService.create(params, auth)
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
 * PATCH /notebooks/:notebookId
 */
exports.update = function(req, res, next) {
    let notebookId = req.params.notebookId;
    let params = req.body;
    let auth = req.auth;

    notebookService.update(notebookId, params, auth)
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
 * DELETE /notebooks/:notebookId
 */
exports.destroy = function(req, res, next) {
    let notebookId = req.params.notebookId;
    let auth = req.auth;

    notebookService.destroy(notebookId, auth)
            .then(() => {
                let payload = new Res.Ok();
                payload = processPayload(payload, req);
                res.status(payload.status).json(payload);
            })
            .catch((err) => {
                next(err);
            });
}
