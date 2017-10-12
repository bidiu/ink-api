const Sequalize = require('sequelize');
const User = require('../models/users');
const InkError = require('../common/models/ink-errors');


/**
 * @param id
 * @param options
 *      _fields     See 'create()'.
 * @returns
 *      A promise to resolve the retrieved data.
 */
function retrieve(id, { _fields = '*' } = {}) {
    return User.findById(id, { attributes: { exclude: User.excludeOnRetrieve }, raw: true })
            .then((retrieved) => {
                if (retrieved) {
                    return User.sanitizeOnRetrieve(retrieved, _fields);
                }
                throw new InkError.NotFound();
            });
}

/**
 * @param params 
 *      Data (field values) from which user will be created. This function won't
 *      alter this parameter.
 * @param options       
 *      _fields     Array of fields to return if successful. '*' means returning 
 *                  all fields, while [] means returning undefined.
 * @return 
 *      A promise to resolve the saved data with specified fields (or undefined).
 */
function create(params, { _fields = '*' } = {}) {
    let sanitized = User.sanitizeOnCreate(params);
    return User.create(sanitized)
            .then((saved) => {
                if (_fields.length !== 0) {
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
                    return User.sanitizeOnRetrieve(retrieved, _fields);
                }
                // client doesn't need response data, by passing []
                return undefined;
            });
}

/**
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
