const Section = require('../models/sections');
const InkError = require('../common/models/ink-errors');
const pagUtils = require('../utils/pagination');
const { appendConditions } = require('../utils/sequel');

const DEFAULT_INDEX_PARAMS = {
    _where: {},
    _order: [ ['createdAt', 'DESC'] ],
    _limit: 12,
    _pageNo: 1
};

function index(notebookId, auth, { params = {} } = {}) {
    params = Object.assign({}, DEFAULT_INDEX_PARAMS, params);
    let where = appendConditions(params._where, { notebookId }, { owner: auth.sub });

    return Section.findAndCountAll({
                attributes: { exclude: Section.excludeOnRetrieve },
                where,
                order: params._order,
                limit: params._limit,
                offset: params._limit * (params._pageNo - 1)
            })
            .then(({count: totalCnt, rows: indexed}) => {
                return pagUtils.addPagInfo({ _indexed: indexed, _totalCnt: totalCnt }, params);
            });
}

function retrieve(sectionId) {
    let where = { id: sectionId };

    return Section.findOne({
                attributes: { exclude: Section.excludeOnRetrieve },
                where
            })
            .then((retrieved) => {
                if (!retrieved) { throw new InkError.NotFound(); }
                return retrieved;
            });
}

/**
 * Note that here no need to check the existance of the notebook, 
 * because auth-verifying middleware already checked the ownership.
 * Even though the ownership verifying is not in a transaction with
 * the creation of section, just let database's foreign key constraint
 * to handle that.
 * 
 * TODO because we are using `paranoid` option of Sequelize, to verify
 * 
 * @param {*} params 
 * @param {*} notebookId
 * @param {*} auth 
 */
function create(params, notebookId, auth) {
    let sanitized = Section.sanitizeOnCreate(params);
    sanitized.notebookId = notebookId;
    sanitized.owner = auth.sub;

    return Section.create(sanitized)
            .then((created) => {
                return retrieve(created.id);
            });
}

/**
 * @param {*} sectionId 
 * @param {*} params 
 */
function update(sectionId, params) {
    let sanitized = Section.sanitizeOnUpdate(params);

    return retrieve(sectionId)
            .then((retrieved) => {
                return retrieved.update(sanitized);
            })
            .then(() => {
                return retrieve(sectionId);
            });
}

/**
 * @param {*} sectionId 
 */
function destroy(sectionId) {
    return retrieve(sectionId)
            .then((retrieved) => {
                return retrieved.destroy();
            });
}

exports.index = index;
exports.retrieve = retrieve;
exports.create = create;
exports.update = update;
exports.destroy = destroy;
