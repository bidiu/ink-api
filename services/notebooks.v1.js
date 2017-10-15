const Notebook = require('../models/notebooks');
const InkError = require('../common/models/ink-errors');
const pagUtils = require('../utils/pagination');


const DEFAULT_INDEX_PARAMS = {
    _order: [ ['createdAt', 'DESC'] ],
    _limit: 10,
    _pageNo: 1,
    _expand: false,
    _expLimit: 20
};

/**
 * @param options (optional)
 *      userId      (optional)
 *      params      (optional) filter conditions (where clause).
 * @return
 *      A promise to resolve the indexed data (could be an empty array if no matches).
 */
function index({ userId, params = {} } = {}) {
    let where = {};
    if (userId) { where.userId = userId; }
    params = Object.assign({}, DEFAULT_INDEX_PARAMS, params);

    return Notebook.findAndCountAll({
                attributes: { exclude: Notebook.excludeOnRetrieve },
                where: where,
                order: params._order,
                limit: params._limit,
                offset: params._limit * (params._pageNo - 1)
            })
            .then(({count: totalCnt, rows: indexed}) => {
                // TODO _endpoint, _next
                return {
                    _indexed: indexed,
                    _pageNo: params._pageNo,
                    _lastPageNo: pagUtils.calcLastPageNo(params._limit, totalCnt),
                    _totalCnt: totalCnt
                };
            });
}

/**
 * @param notebookId
 *      id of the notebook to retrieve.
 * @param options
 *      userId      (optional)
 *      params      (optional) _expand, _expLimit, ...
 *                  This function and others down below won't alter it.
 * @returns
 *      A promise to resolve the retrieved data.
 */
function retrieve(notebookId, { userId, params = {} } = {}) {
    let where = { id: notebookId };
    if (userId) { where.userId = userId; }

    return Notebook.findOne({
                attributes: { exclude: Notebook.excludeOnRetrieve },
                where: where,
                include: Notebook.getExpandDef(
                    { expand: params._expand, expLimit: params._expLimit }
                )
            })
            .then((retrieved) => {
                if (retrieved) {
                    return retrieved;
                }
                throw new InkError.NotFound();
            });
}

/**
 * TODO should be in an transaction
 * 
 * @param params 
 *      Data (field values) from which notebook will be created. This function won't
 *      alter this parameter.
 * @return 
 *      A promise to resolve the created data.
 */
function create(params) {
    let sanitized = Notebook.sanitizeOnCreate(params);

    return Notebook.create(sanitized)
            .then((created) => {
                return retrieve(created.id, { params: params });
            });
}

/**
 * TODO should be in an transaction
 * TODO updating secret, password ...
 * 
 * @param notebookId
 *      id of the notebook to update.
 * @param params 
 *      Data (field values) from which notebook will be updated. This function won't
 *      alter this parameter.
 * @param options (optional)
 *      userId      (optional)
 * @return 
 *      A promise to resolve the updated data.
 */
function update(notebookId, params, { userId } = {}) {
    let sanitized = Notebook.sanitizeOnUpdate(params);

    return retrieve(notebookId, { userId: userId, params: params })
            .then((retrieved) => {
                return retrieved.update(sanitized);
            });
}

/**
 * TODO transaction
 * 
 * @param notebookId
 *      notebookId of the notebook to delete.
 * @param options (optional)
 *      userId      (optional)
 */
function destroy(notebookId, { userId } = {}) {
    return retrieve(notebookId, { userId: userId })
            .then((retrieved) => {
                return retrieved.destroy();
            });
}


exports.index = index;
exports.retrieve = retrieve;
exports.create = create;
exports.update = update;
exports.destroy = destroy;
