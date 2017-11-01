const Notebook = require('../models/notebooks');
const InkError = require('../common/models/ink-errors');
const pagUtils = require('../utils/pagination');


// no need to take care '_expand' here
const DEFAULT_INDEX_PARAMS = {
    _where: {},
    _order: [ ['createdAt', 'DESC'] ],
    _limit: 12,
    _pageNo: 1
};

/**
 * @param path
 *      used to generate response
 * @param options (optional)
 *      userId      (optional)
 *      params      (optional) filter conditions (where clause).
 * @return
 *      A promise to resolve the indexed data (could be an empty array if no matches).
 */
function index(path, { userId, params = {} } = {}) {
    params = Object.assign({}, DEFAULT_INDEX_PARAMS, params);
    if (userId) { params._where.userId = +userId; }

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
                include: Notebook.getExpandDef(params)
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
