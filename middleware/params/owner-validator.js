const authUtils = require('../../utils/auth');
const serviceMap = require('../../services/services.v1');
const userService = require('../../services/users.v1');
const InkError = require('../../common/models/ink-errors');

/**
 * owner validator
 * 
 * @param {*} name 
 *      parameter name (field)
 * @param {*} val 
 *      the value to validate
 * @param {*} req 
 * @param {*} options 
 */
async function validate(name, val, req, { model: modelName }) {
    if (!val) { return; }

    try {
        let service = serviceMap.get(modelName);
        authUtils.verifyOwner(await service.retrieve(val), req.auth);
    } catch(err) {
        throw err instanceof InkError.NoAuthorization ? err : new InkError.NoAuthorization();
    }
}

module.exports = validate;
