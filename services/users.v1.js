const Sequalize = require('sequelize');
const User = require('../models/users');
const Err = require('../common/err');


/**
 * Notes:
 *      1. Outside can execute this service.
 *      2. This function won't change the parameter 'params'.
 * 
 * @param params
 *      MUST have following attr:
 *          id:         id of the user to retrieve
 *          _fields:    See "create()".
 * @returns
 *      A promise to resolve the retrieved data (null if it doesn't 
 *      exist), or to reject with any error.
 */
exports.retrieve = function(params) {
    return User.findById(params.id, { attributes: { exclude: User.excludeOnRetrieve }, raw: true })
            .then((retrieved) => {
                if (retrieved) {
                    return User.sanitizeOnRetrieve(retrieved, params._fields);
                }
                return null;
            });
}

/**
 * Notes:
 *      1. Outside can execute this service.
 *      2. This function won't change the parameter 'params'.
 * 
 * @param params 
 *      Data to be created and saved, There are also some meta params:
 *              _fields:    Array of fields to return if successful.
 *                          '*' means returning all fields, while []
 *                          means returning null.
 * @return 
 *      A promise to resolve the saved data, or to reject with any error
 */
exports.create = function(params) {
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
                return null;
            })
            .then((retrieved) => {
                if (retrieved) {
                    return User.sanitizeOnRetrieve(retrieved, params._fields);
                }
                return null;
            });
}
