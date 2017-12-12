const InkError = require('../../common/models/ink-errors');

function validate(name, val, req) {
    if (typeof val === 'undefined') { return; }

    let message = `Ban validator: parameter ${name} is banned for this endpoint.`;
    throw new InkError.BadReq({ message });
}

module.exports = validate;
