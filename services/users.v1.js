const Sequalize = require('sequelize');
const User = require('../models/users');
const InkError = require('../common/models/ink-errors');


/**
 * @param id
 *      id of the user to retrieve.
 * @param options
 *      raw         ture means only data, without instance methods and attr from 
 *                  sequelize.
 * @returns
 *      A promise to resolve the retrieved data.
 */
function retrieve(id, { raw = true } = {}) {
    return User.findById(id, { attributes: { exclude: User.excludeOnRetrieve }, raw: raw })
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
 * @param options       
 *      raw         ture means only data, without instance methods and attr from 
 *                  sequelize.
 * @return 
 *      A promise to resolve the saved data with specified fields (or undefined).
 */
function create(params, { raw = true } = {}) {
    let sanitized = User.sanitizeOnCreate(params);
    
    return User.create(sanitized)
            .then((saved) => {
                return retrieve(saved.id, { raw: raw });
            });
}

/**
 * TODO should be in an transaction
 * TODO updating secret
 * 
 * @param params 
 *      Data (field values) from which user will be updated. This function won't
 *      alter this parameter.
 * @param options       
 *      raw         ture means only data, without instance methods and attr from 
 *                  sequelize.
 * @return 
 *      A promise to resolve the updated data with specified fields (or undefined).
 */
function update(id, params, { raw = true } = {}) {
    let sanitized = User.sanitizeOnUpdate(params);

    // TODO
} 


exports.retrieve = retrieve;
exports.create = create;
exports,update = update;
