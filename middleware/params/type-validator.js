const InkError = require('../../common/models/ink-errors');

/**
 * type validator
 * 
 * @param
 *      parameter name (field)
 * @param {*} val
 *      the value to validate
 * @param {*} options
 *      type - number, boolean, string, object
 */
function validate(name, val, auth, { type, allowNull = true, required = false }) {
    if (!required && typeof val === 'undefined' || allowNull && val === null || val && typeof val === type) {
        return;
    }

    let message = `Type validator: parameter ${name}'s type should be ${type} \
(allowNull: ${allowNull}, required: ${required}).`;
    throw new InkError.BadReq({ message });
}

module.exports = validate;
