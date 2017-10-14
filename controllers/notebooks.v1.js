const notebookService = require('../services/notebooks.v1');
const Res = require('../common/models/responses');


/**
 * GET /users/:userId/notebooks
 * GET /notebooks
 */
exports.index = function(req, res, next) {
    res.end('index');
}

/**
 * GET /users/:userId/notebooks/:notebookId
 */
exports.retrieve = function(req, res, next) {
    let notebookId = req.params.notebookId;
    let userId = req.params.userId; // might be undefined

    notebookService.retrieve(notebookId, { userId: userId })
            .then((retrieved) => {
                let payload = new Res.Ok({ data: retrieved });
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
 * Never specific foreign owner key in the request body, 
 * otherwise it will be ignored.
 */
exports.create = function(req, res, next) {
    let params = req.body;
    params.userId = req.params.userId;

    notebookService.create(params)
            .then((created) => {
                let payload = new Res.Ok({ data: created });
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
    res.end('update');
}

/**
 * DELETE /users/:userId/notebooks/:notebookId
 * DELETE /notebooks/:notebookId
 */
exports.destroy = function(req, res, next) {
    res.end('destroy');
}
