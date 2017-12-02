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
    res.end('retrieve');
}

/**
 * POST /notebooks/:notebookId/sections
 */
exports.create = function(req, res, next) {
    res.end('create');
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
