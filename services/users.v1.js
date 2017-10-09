const Sequalize = require('sequelize');
const User = require('../models/users');
const Err = require('../common/err');


/**
 * Note:
 *      1. Outside can execute this service
 *      2. This function won't change the parameter 'params'
 * 
 * @param params 
 *      data to be created and saved, There are also some meta params:
 *              _fields:    (optional) array of fields to return if successful, 
 *                          undefined/'*' means returning all fields
 * @return 
 *      A promise to resolve the saved data (null if _fields is not present),
 *      or to reject with any error
 */
exports.create = function(params) {
    let sanitized = User.sanitizeOnCreate(params);
    return User.create(sanitized)
            .then((saved) => {
                return User.sanitizeOnRetrieve(saved.get({ plain: true }), params._fields);
            });
}
