const notebookService = require('../services/notebooks.v1');
const Res = require('../common/models/responses');
const processPayload = require('../middleware/payload/payload');


/**
 * GET /users/:userId/notebooks
 * GET /notebooks
 */
exports.index = function(req, res, next) {
    let userId = req.params.userId; // might be undefined
    let params = req.query;

    notebookService.index(req.path, { userId, params })
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
 * GET /users/:userId/notebooks/:notebookId
 */
exports.retrieve = function(req, res, next) {
    let notebookId = req.params.notebookId;
    let userId = req.params.userId; // might be undefined
    let params = req.query;

    notebookService.retrieve(notebookId, { userId, params })
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
 * POST /users/:userId/notebooks
 * TODO POST /notebooks
 * 
 * Never specify foreign owner key in the request body, 
 * otherwise it will be ignored.
 */
exports.create = function(req, res, next) {
    let params = req.body;
    params.userId = req.params.userId;

    notebookService.create(params)
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
 * PATCH /users/:userId/notebooks/:notebookId
 * PATCH /notebooks/:notebookId
 */
exports.update = function(req, res, next) {
    let notebookId = req.params.notebookId;
    let userId = req.params.userId; // might be undefined
    let params = req.body;

    notebookService.update(notebookId, params, { userId })
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
 * DELETE /users/:userId/notebooks/:notebookId
 * DELETE /notebooks/:notebookId
 */
exports.destroy = function(req, res, next) {
    let notebookId = req.params.notebookId;
    let userId = req.params.userId; // might be undefined

    notebookService.destroy(notebookId, { userId })
            .then(() => {
                let payload = new Res.Ok();
                payload = processPayload(payload, req);
                res.status(payload.status).json(payload);
            })
            .catch((err) => {
                next(err);
            });
}
