const Res = require('../common/models/responses');


/**
 * GET /users/:userId/notebooks
 * TODO GET /notebooks
 */
exports.index = function(req, res, next) {
    res.end('index');
}

/**
 * GET /users/:userId/notebooks/:notebookId
 * TODO GET /notebooks/:notebookId
 */
exports.retrieve = function(req, res, next) {
    res.end('retrieve');
}

/**
 * POST /users/:userId/notebooks
 * TODO POST /notebooks
 */
exports.create = function(req, res, next) {
    res.end('create');
}

/**
 * PATCH /users/:userId/notebooks/:notebookId
 * TODO PATCH /notebooks/:notebookId
 */
exports.update = function(req, res, next) {
    res.end('update');
}

/**
 * DELETE /users/:userId/notebooks/:notebookId
 * TODO DELETE /notebooks/:notebookId
 */
exports.destroy = function(req, res, next) {
    res.end('destroy');
}
