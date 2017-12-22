const noteService = require('../services/notes.v1');
const Res = require('../common/models/responses');
const processPayload = require('../middleware/payload/payload');

/**
 * GET /notes
 */
exports.index = async function(req, res, next) {
    let auth = req.auth;
    let params = req.query;

    let data = await noteService.index(auth, { params });
    let payload = await processPayload(new Res.Ok({ data }), req);
    res.status(payload.status).json(payload);
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
    let noteId = +req.params.noteId;
    
    await noteService.destroy(noteId);
    let payload = await processPayload(new Res.Ok(), req);
    res.status(payload.status).json(payload);
}

/**
 * GET /notes/:noteId(\\d+)/tags
 */
exports.tagIndex = async function(req, res, next) {
    let noteId = +req.params.noteId;

    let data = await noteService.tagIndex(noteId);
    let payload = await processPayload(new Res.Ok({ data }), req);
    res.status(payload.status).json(payload);
}

/**
 * PUT /notes/:noteId(\\d+)/tags
 */
exports.tagReplace = async function(req, res, next) {
    let noteId = +req.params.noteId;
    let names = req.body.names;

    await noteService.tagReplace(noteId, names);
    let payload = await processPayload(new Res.Ok(), req);
    res.status(payload.status).json(payload);
}

/**
 * PATCH /notes/:noteId(\\d+)/tags
 */
exports.tagUpdate = async function(req, res, next) {
    res.end(noteService.tagUpdate());
}

/**
 * DELETE /notes/:noteId(\\d+)/tags/:tag
 */
exports.tagDestroy = async function(req, res, next) {
    res.end(noteService.tagDestroy());
}
