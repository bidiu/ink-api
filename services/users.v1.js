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
 *          _fields:    (optional) See "create()".
 * @returns
 *      A promise to resolve the retrieved data (null) if it doesn't 
 *      exists, or to reject with any error.
 */
exports.retrieve = function(params) {
    return User.findById(params.id)
            .then((retrieved) => {
                if (retrieved) {
                    return User.sanitizeOnRetrieve(retrieved.get({ plain: true }), params._fields);
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
 *      data to be created and saved, There are also some meta params:
 *              _fields:    (optional) array of fields to return if successful.
 *                          undefined/'*' means returning all fields, while []
 *                          means return empty object {}.
 * @return 
 *      A promise to resolve the saved data, or to reject with any error
 */
exports.create = function(params) {
    let sanitized = User.sanitizeOnCreate(params);
    return User.create(sanitized)
            .then((saved) => saved.reload())
            .then((saved) => {
                return User.sanitizeOnRetrieve(saved.get({ plain: true }), params._fields);
            });
}
