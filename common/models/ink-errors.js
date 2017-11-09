/* a generic error type */
function InkError(message, details, data) {
    Error.call(this);
    this.message = message;
    this.details = details;
    this.data = data;
}

InkError.prototype = Object.create(Error.prototype);
InkError.prototype.constructor = InkError;


/* more specific errors */
const ERROR_TYPES = [
    (() => {
        function BadReq({ message = 'Request is bad.', details, data } = {}) {
            InkError.call(this, message, details, data);
        }
        return BadReq;
    })(),
    (() => {
        function NotFound({ message = 'Resources are not found.', details, data } = {}) {
            InkError.call(this, message, details, data);
        }
        return NotFound;
    })(),
    (() => {
        // either no authentication or bad authentication
        function BadAuthentication({ message = 'You are not authenticated.', details, data } = {}) {
            InkError.call(this, message, details, data);
        }
        return BadAuthentication;
    })(),
    (() => {
        function NoAuthorization({ message = 'You don\'t have the authorization.', details, data } = {}) {
            InkError.call(this, message, details, data);
        }
        return NoAuthorization;
    })()
];

ERROR_TYPES.forEach((errorType) => {
    errorType.prototype = Object.create(InkError.prototype);
    errorType.prototype.constructor = errorType;
    InkError[errorType.name] = errorType;
});


module.exports = InkError;
