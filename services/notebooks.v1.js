const sequelize = require('../db/db');
const Notebook = require('../models/notebooks');
const InkError = require('../common/models/ink-errors');
const pagUtils = require('../utils/pagination');

const NotebookCount = Notebook.NotebookCount;

// no need to take care '_expand' here
const DEFAULT_INDEX_PARAMS = {
    _where: {},
    _order: [ ['createdAt', 'DESC'] ],
    _limit: 12,
    _pageNo: 1
};

/**
 * similar to `userService._processWhereForSharing`.
 */
function _processWhereForIndex(where, userId) {
    return {
        $and: [
            where, 
            { userId }
        ]
    };
}

/**
 * @param userId
 * @param options (optional)
 *      params      (optional) filter conditions (where clause).
 * @return
 *      A promise to resolve the indexed data (could be an empty array if no matches).
 */
function index(userId, { params = {} } = {}) {
    params = Object.assign({}, DEFAULT_INDEX_PARAMS, params);
    params._where = _processWhereForIndex(params._where, userId);

    return Notebook.findAndCountAll({
                attributes: { exclude: Notebook.excludeOnRetrieve },
                where: params._where,
                include: Notebook.getExpandDef(params),
                order: params._order,
                limit: params._limit,
                offset: params._limit * (params._pageNo - 1)
            })
            .then(({count: totalCnt, rows: indexed}) => {
                return pagUtils.addPagInfo({ _indexed: indexed, _totalCnt: totalCnt }, params);
            });
}

/**
 * @param notebookId
 *      id of the notebook to retrieve.
 * @param options
 *      params      (optional) _expand, _expLimit, ...
 *                  This function and others down below won't alter it.
 * @returns
 *      A promise to resolve the retrieved data.
 */
function retrieve(notebookId, { params = {} } = {}) {
    let where = { id: notebookId };

    return Notebook.findOne({
                attributes: { exclude: Notebook.excludeOnRetrieve },
                where: where,
                include: Notebook.getExpandDef(params)
            })
            .then((retrieved) => {
                if (!retrieved) { throw new InkError.NotFound(); }
                return retrieved;
            });
}

/**
 * Will start a new transaction.
 * 
 * @param params 
 *      Data (field values) from which notebook will be created. This function won't
 *      alter this parameter.
 * @param auth
 * @return 
 *      A promise to resolve the created data.
 */
function create(params, auth) {
    let sanitized = Notebook.sanitizeOnCreate(params);
    sanitized.userId = auth.sub;

    return sequelize.transaction((transaction) => {

        let id = null;
        return retrieveCount(auth.sub, { findOptions: { lock: transaction.LOCK.UPDATE } })
                .then((count) => {
                    sanitized.order = count + 1;
                    return Notebook.create(sanitized);
                })
                .then((created) => {
                    id = created.id;
                    return increaseCount(auth.sub);
                })
                .then(() => {
                    return retrieve(id);
                });
    });
}

/**
 * TODO should be in an transaction
 * 
 * @param notebookId
 *      id of the notebook to update.
 * @param params 
 *      Data (field values) from which notebook will be updated. This function won't
 *      alter this parameter.
 * @return 
 *      A promise to resolve the updated data.
 */
function update(notebookId, params) {
    let sanitized = Notebook.sanitizeOnUpdate(params);

    return retrieve(notebookId)
            .then((retrieved) => {
                return retrieved.update(sanitized);
            })
            .then(() => {
                return retrieve(notebookId);
            });
}

/**
 * TODO transaction
 * 
 * @param notebookId
 *      notebookId of the notebook to delete.
 * @param auth
 */
function destroy(notebookId) {
    return retrieve(notebookId)
            .then((retrieved) => {
                return retrieved.destroy();
            });
}

/**
 * Retrieve how many notebooks the user currently have.
 * Note that usually you MUST wrap this with a transaction, and 
 * provide the UPDATE lock as an option (using the optional param
 * `findOptions`).
 * 
 * This a function private to this module.
 * 
 * @param {*} userId 
 * @param {*} options
 *      - findOptions
 *          the options given to sequelize `find` function. If 
 *          you provide dupulcate (to other params if this function)
 *          inside the findOptions, the ones in `findOptions` will
 *          be overwritten.
 */
function retrieveCount(userId, { findOptions } = {}) {
    return NotebookCount.findOne({
                ...findOptions,
                where: { userId }
            })
            .then((retrieved) => {
                if (retrieved) {
                    return retrieved.count;
                }
                return NotebookCount.create({ count: 0, userId })
                        .then((created) => {
                            return created.count;
                        });
            });
}

/**
 * See function `retrieveCount` above. This function assumes that
 * the row related to the given `userId` already existed.
 * 
 * This a function private to this module.
 * 
 * @param {*} userId
 * @return a promise resolving nothing
 */
function increaseCount(userId) {
    return NotebookCount.findOne({
                where: { userId }
            })
            .then((retrieved) => {
                return retrieved.update({ count: retrieved.count + 1 });
            });
}

exports.index = index;
exports.retrieve = retrieve;
exports.create = create;
exports.update = update;
exports.destroy = destroy;
