const sequelize = require('../db/db');
const Note = require('../models/notes');
const Tag = require('../models/tags');
const tagService = require('../services/tags.v1');
const InkError = require('../common/models/ink-errors');
const pagUtils = require('../utils/pagination');
const { appendConditions } = require('../utils/sequel');

const DEFAULT_INDEX_PARAMS = {
    _summary: false,
    _where: {},
    _order: [ ['createdAt', 'DESC'] ],
    _limit: 12,
    _pageNo: 1
};

const EXCLUDE_FOR_SUMMARY = [
    ...Note.excludeOnRetrieve,
    ...['content']
];

function index(auth, { params = {} } = {}) {
    params = Object.assign({}, DEFAULT_INDEX_PARAMS, params);
    let exclude = params._summary ? EXCLUDE_FOR_SUMMARY : Note.excludeOnRetrieve;
    let where = appendConditions(params._where, { $or: [{ private: false }, { owner: auth.sub }] });

    return Note.findAndCountAll({
                attributes: { exclude },
                where,
                include: [{
                    model: Tag, 
                    attributes: ['name'], 
                    through: { attributes: ['updatedAt'] }
                }],
                order: params._order,
                limit: params._limit,
                offset: params._limit * (params._pageNo - 1)
            })
            .then(({count: totalCnt, rows: indexed}) => {
                return pagUtils.addPagInfo({ _indexed: indexed, _totalCnt: totalCnt }, params);
            });
}

function retrieve(noteId, { transaction } = {}) {
    let where = { id: noteId };

    return Note.findOne({
                attributes: { exclude: Note.excludeOnRetrieve },
                where,
                include: [{
                    model: Tag, 
                    attributes: ['name'], 
                    through: { attributes: ['updatedAt'] }
                }],
                transaction
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

function destroy(noteId) {
    return retrieve(noteId)
            .then((retrieved) => {
                return retrieved.destroy();
            });
}

/**
 * will start a new transaction
 * 
 * @param {*} noteId 
 */
function tagIndex(noteId) {
    return sequelize.transaction((transaction) => {

        return retrieve(noteId)
                .then((note) => {
                    return note.getTags();
                })
                .then((tags) => {
                    return { _indexed: tags };
                });
    });
}

/**
 * will start a new transaction
 * 
 * @param {*} noteId
 * @param {*} names tag names
 */
function tagReplace(noteId, names) {
    return sequelize.transaction((transaction) => {
        let note = null;

        return retrieve(noteId)
                .then((retrieved) => {
                    note = retrieved;
                })
                .then(() => {
                    return Promise.all(
                        names.map((name) => tagService.retrieveOrCreate(name, { transaction }))
                    );
                })
                .then((tags) => {
                    return note.setTags(tags);
                });
    });
}

/**
 * will start a new transaction
 * 
 * @param {*} noteId 
 * @param {*} names 
 */
function tagUpdate(noteId, names) {
    return sequelize.transaction((transaction) => {
        let note = null;

        return retrieve(noteId)
                .then((retrieved) => {
                    note = retrieved;
                })
                .then(() => {
                    return Promise.all(
                        names.map((name) => tagService.retrieveOrCreate(name, { transaction }))
                    );
                })
                .then((tags) => {
                    return note.addTags(tags);
                });
    });
}

/**
 * will start a new transaction
 * 
 * @param {*} noteId 
 * @param {*} name tag name
 */
function tagDestroy(noteId, name) {
    return sequelize.transaction((transaction) => {

        return retrieve(noteId)
                .then((note) => {
                    return note.removeTag(name);
                });
    });
}

exports.index = index;
exports.retrieve = retrieve;
exports.create = create;
exports.update = update;
exports.destroy = destroy;
exports.tagIndex = tagIndex;
exports.tagReplace = tagReplace;
exports.tagUpdate = tagUpdate;
exports.tagDestroy = tagDestroy;
