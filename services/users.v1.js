const Sequalize = require('sequelize');
const User = require('../models/users');
const InkError = require('../common/models/ink-errors');


/**
 * Outside can execute this service.
 * This function won't change the parameter 'params'.
 * 
 * @param params
 *      MUST have following attributes:
 *          id:         id of the user to retrieve
 *          _fields:    See "create()".
 * @returns
 *      A promise to resolve the retrieved data.
 */
function retrieve(params) {
    return User.findById(params.id, { attributes: { exclude: User.excludeOnRetrieve }, raw: true })
            .then((retrieved) => {
                if (retrieved) {
                    return User.sanitizeOnRetrieve(retrieved, params._fields);
                }
                throw new InkError.NotFound();
            });
}

/**
 * Outside can execute this service.
 * This function won't change the parameter 'params'.
 * 
 * @param params 
 *      Data to be created. There are also some meta params:
 *              _fields:    Array of fields to return if successful. '*' means 
 *                          returning all fields, while [] means returning undefined.
 * @return 
 *      A promise to resolve the saved data with specified fields (or undefined).
 */
function create(params) {
    let sanitized = User.sanitizeOnCreate(params);
    return User.create(sanitized)
            .then((saved) => {
                if (params._fields.length !== 0) {
                    // TODO should be in an transaction
                    return User.findById(saved.id, {
                        attributes: { exclude: User.excludeOnRetrieve }, 
                        raw: true 
                    });
                }
                // client doesn't need response data, by passing []
                return undefined;
            })
            .then((retrieved) => {
                if (retrieved) {
                    return User.sanitizeOnRetrieve(retrieved, params._fields);
                }
                // client doesn't need response data, by passing []
                return undefined;
            });
}

/**
 * Outside can execute this service.
 * This function won't change the parameter 'params'.
 * 
 * @param params
 *      Data to be updated, There are also some meta params:
 *              _fields:    Array of fields to return if successful.
 *                          '*' means returning all fields, while []
 *                          means returning null.
 * @return
 *      A promise to resolve the updated data, or to reject with any error.
 */
function update(params) {
    // TODO let sanitized = User.sanitizeOnUpdate(params);
} 


exports.retrieve = retrieve;
exports.create = create;
exports,update = update;
