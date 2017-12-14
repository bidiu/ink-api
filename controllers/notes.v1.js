const noteService = require('../services/notes.v1');
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
    let noteId = +req.params.noteId;

    let data = await noteService.retrieve(noteId);
    let payload = await processPayload(new Res.Ok({ data }), req);
    res.status(payload.status).json(payload);
}

/**
 * POST /sections/:sectionId(\\d+)/notes
 */
exports.create = async function(req, res, next) {
    let params = req.body;
    let sectionId = +req.params.sectionId;
    let auth = req.auth;

    let data = await noteService.create(params, sectionId, auth);
    let payload = await processPayload(new Res.Ok({ data }), req);
    res.status(payload.status).json(payload);
}

/**
 * PATCH /notes/:noteId(\\d+)
 */
exports.update = async function(req, res, next) {
    let noteId = +req.params.noteId;
    let params = req.body;

    let data = await noteService.update(noteId, params);
    let payload = await processPayload(new Res.Ok({ data }), req);
    res.status(payload.status).json(payload);
}

/**
 * DELETE /notes/:noteId(\\d+)
 */
exports.destroy = async function(req, res, next) {
    res.end('destroy');
}
