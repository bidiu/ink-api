/*
 * Abstraction of all types of errors.
 */

/** a generic error type */
function InkError(message, details, data, customCode) {
    Error.call(this);
    this.message = message;
    this.details = details;
    this.data = data;
    this.customCode = customCode;
}

InkError.prototype = Object.create(Error.prototype);
InkError.prototype.constructor = InkError;

/* more specific errors */
const ERROR_TYPES = [
    (() => {
        function BadReq({ message = 'Request is bad.', details, data, customCode } = {}) {
            InkError.call(this, message, details, data, customCode);
        }
        return BadReq;
    })(),
    (() => {
        function NotFound({ message = 'Resources are not found.', details, data, customCode } = {}) {
            InkError.call(this, message, details, data, customCode);
        }
        return NotFound;
    })(),
    (() => {
        // either no authentication or bad authentication
        function BadAuthentication({ message = 'You are not authenticated.', details, data, customCode } = {}) {
            InkError.call(this, message, details, data, customCode);
        }
        return BadAuthentication;
    })(),
    (() => {
        function NoAuthorization({ message = 'You don\'t have the authorization.', details, data, customCode } = {}) {
            InkError.call(this, message, details, data, customCode);
        }
        return NoAuthorization;
    })(),
    (() => {
        function InternalErr({ message = 'Internal server error occurred.', details, data, customCode } = {}) {
            InkError.call(this, message, details, data, customCode);
        }
        return InternalErr;
    })()
];

ERROR_TYPES.forEach((errorType) => {
    errorType.prototype = Object.create(InkError.prototype);
    errorType.prototype.constructor = errorType;
    InkError[errorType.name] = errorType;
});


module.exports = InkError;
