const Res = require('../common/models/responses');
const processPayload = require('../middleware/payload/payload');

/**
 * GET /notes
 * GET /sections/:sectionId(\\d+)/notes
 */
exports.index = async function(req, res, next) {
    res.end('index');
}

/**
 * GET /notes/:noteId(\\d+)
 */
exports.retrieve = async function(req, res, next) {
    res.end('retrieve');
}

/**
 * POST /sections/:sectionId(\\d+)/notes
 */
exports.create = async function(req, res, next) {
    res.end('create');
}

/**
 * PATCH /notes/:noteId(\\d+)
 */
exports.update = async function(req, res, next) {
    res.end('update');
}

/**
 * DELETE /notes/:noteId(\\d+)
 */
exports.destroy = async function(req, res, next) {
    res.end('destroy');
}
