const Note = require('../models/notes');
const InkError = require('../common/models/ink-errors');
const pagUtils = require('../utils/pagination');

function retrieve(noteId) {
    let where = { id: noteId };

    return Note.findOne({
                attributes: { exclude: Note.excludeOnRetrieve },
                where
            })
            .then((retrieved) => {
                if (!retrieved) { throw new InkError.NotFound(); }
                return retrieved;
            });
}

function create(params, sectionId, auth) {
    let sanitized = Note.sanitizeOnCreate(params);
    sanitized.sectionId = sectionId;
    sanitized.owner = auth.sub;

    return Note.create(sanitized)
            .then((created) => {
                return retrieve(created.id);
            });
}

function update(noteId, params) {
    let sanitized = Note.sanitizeOnUpdate(params);

    return retrieve(noteId)
            .then((retrieved) => {
                return retrieved.update(sanitized);
            })
            .then(() => {
                return retrieve(noteId);
            });
}

exports.retrieve = retrieve;
exports.create = create;
exports.update = update;
