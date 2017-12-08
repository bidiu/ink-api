const InkError = require('../../common/models/ink-errors');

/**
 * Note you MUST use `type` validator first (number type).
 * 
 * @param {*} name 
 * @param {*} val 
 * @param {*} auth 
 * @param {*} options 
 */
function validate(name, val, auth, { min, max }) {
    if (!val || val >= min && val <= max) { return; }

    let message = `Range validator: parameter ${name}'s range should be ${min} ~ ${max} (inclusive).`;
    throw new InkError.BadReq({ message });
}

module.exports = validate;
