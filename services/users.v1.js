const User = require('../models/users');
const InkError = require('../common/models/ink-errors');
const authUtils = require('../utils/auth');
const pagUtils = require('../utils/pagination');


// no need to take care '_expand' here
const DEFAULT_INDEX_PARAMS = {
    _where: {},
    _order: [ ['createdAt', 'DESC'] ],
    _limit: 12,
    _pageNo: 1
};

/**
 * @param options (optional)
 *      params      (optional) filter conditions (where/order/limit/pageNo...)
 * @return
 *      A promise to resolve the indexed data (could be an empty array if no matches).
 */
function index({ params = {} } = {}) {
    params = Object.assign({}, DEFAULT_INDEX_PARAMS, params);

    return User.findAndCountAll({
                attributes: { exclude: User.excludeOnRetrieve },
                where: params._where,
                include: User.getExpandDef(params),
                order: params._order,
                limit: params._limit,
                offset: params._limit * (params._pageNo - 1)
            })
            .then(({count: totalCnt, rows: indexed}) => {
                return pagUtils.addPagInfo({ _indexed: indexed, _totalCnt: totalCnt }, params);
            });
}

/**
 * @param id
 *      id of the user to retrieve.
 * @returns
 *      A promise to resolve the retrieved data.
 */
function retrieve(id, { params = {} } = {}) {
    return User.findById(id, {
                attributes: { exclude: User.excludeOnRetrieve },
                include: User.getExpandDef(params)
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
 *      Data (field values) from which user will be created. This function won't
 *      alter this parameter.
 * @return 
 *      A promise to resolve the created data with specified fields (or undefined).
 */
function create(params) {
    let sanitized = User.sanitizeOnCreate(params);
    sanitized.salt = authUtils.genSalt();

    return authUtils.deriveKey(sanitized.password, sanitized.salt)
            .then((derivedKey) => {
                sanitized.password = derivedKey;
                return User.create(sanitized)
            })
            .then((created) => {
                return retrieve(created.id, { params });
            });
}

function _updatePasswd(retrieved, password, oldPassword) {
    if (!password) { throw new InkError.BadReq({ message: 'You have to provide the new password.' }); }

    return retrieved.reload()
            .then((retrieved) => {
                return authUtils.verifyPasswd(oldPassword, retrieved.salt, retrieved.password);
            })
            .then(() => {
                return authUtils.deriveKey(password, retrieved.salt);
            })
            .then((password) => {
                return retrieved.update({ password });
            });
}

/**
 * You should NOT call this to update password and other fields
 * at the same time. Instead, you should call this method first
 * to update password, and then call second time to update other 
 * fields (or switch the order). Because updating password and 
 * other fields at the same time is a very rare scenario. If you 
 * violate this, only password will be updated.
 * 
 * TODO should be in an transaction
 * 
 * @param id
 *      id of the user to update.
 * @param params 
 *      Data (field values) from which user will be updated. This function won't
 *      alter this parameter.
 * @return 
 *      A promise to resolve the updated data with specified fields (or undefined).
 */
function update(id, params) {
    let sanitized = User.sanitizeOnUpdate(params);

    return retrieve(id, { params })
            .then((retrieved) => {
                if (sanitized.password || sanitized.oldPassword) {
                    // update password
                    return _updatePasswd(retrieved, sanitized.password, sanitized.oldPassword);
                } else {
                    // update other fields
                    delete sanitized.password;
                    delete sanitized.oldPassword;
                    return retrieved.update(sanitized);
                }
            })
            .then(() => {
                return retrieve(id, { params });
            });
}

/**
 * TODO transaction
 * 
 * @param id
 *      id of the user to delete.
 */
function destroy(id) {
    return retrieve(id)
            .then((retrieved) => {
                return retrieved.destroy();
            });
}


exports.index = index;
exports.retrieve = retrieve;
exports.create = create;
exports.update = update;
exports.destroy = destroy;
