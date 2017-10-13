const Sequalize = require('sequelize');
const User = require('../models/users');
const InkError = require('../common/models/ink-errors');


/**
 * @param id
 *      id of the user to retrieve.
 * @returns
 *      A promise to resolve the retrieved data.
 */
function retrieve(id) {
    return User.findById(id, { attributes: { exclude: User.excludeOnRetrieve } })
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
    
    return User.create(sanitized)
            .then((created) => {
                return retrieve(created.id);
            });
}

/**
 * TODO should be in an transaction
 * TODO updating secret, password ...
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

    return retrieve(id)
            .then((retrieved) => {
                return retrieved.update(sanitized)
            })
            .then((updated) => {
                return updated;
            });
}

function destroy(id) {
    return retrieve(id)
            .then((retrieved) => {
                return retrieved.destroy();
            })
}


exports.retrieve = retrieve;
exports.create = create;
exports.update = update;
exports.destroy = destroy;
