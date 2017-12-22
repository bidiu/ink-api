const InkError = require('../../common/models/ink-errors');

function validate(name, val, req, { allowNull = false, required = false, elType, elNull = false }) {
    if (!required && typeof val === 'undefined' || allowNull && val === null) {
        return;
    }

    
    function onErr() {
        let message = `Array validator: parameter ${name}'s type should be an array of ${elType} \
(allowNull: ${allowNull}, required: ${required}, elNull: ${elNull}).`;
        throw new InkError.BadReq({ message });
    }

    if ( !(val instanceof Array) ) {
        onErr();
    }

    for (let el of val) {
        if (!elNull && el === null || typeof el !== elType) {
            onErr();
        }
    }
}

module.exports = validate;
