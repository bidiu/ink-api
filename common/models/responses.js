/*
 * Abstraction of all types of responses.
 */

function Res(status, message, details, data, customCode) {
    this.status = status;
    this.message = message;
    this.details = details;
    this.data = data;
    this.customCode = customCode;
}

const RES_TYPES = [
    (() => {
        function Ok({ message = 'OK', details, data, customCode } = {}) {
            Res.call(this, 200, message, details, data, customCode);
        }
        return Ok;
    })(),
    (() => {
        function BadReq({ message = 'Bad Request', details, data, customCode } = {}) {
            Res.call(this, 400, message, details, data, customCode);
        }
        return BadReq;
    })(),
    (() => {
        function UnAuth({ message = 'Unauthorized', details, data, customCode } = {}) {
            Res.call(this, 401, message, details, data, customCode);
        }
        return UnAuth;
    })(),
    (() => {
        function Forbidden({ message = 'Forbidden', details, data, customCode } = {}) {
            Res.call(this, 403, message, details, data, customCode);
        }
        return Forbidden;
    })(),
    (() => {
        function NotFound({ message = 'Not Found', details, data, customCode } = {}) {
            Res.call(this, 404, message, details, data, customCode);
        }
        return NotFound;
    })(),
    (() => {
        // 5xx
        function ServerErr({ message = 'Internal Server Error', details, data, customCode } = {}) {
            Res.call(this, 500, message, details, data, customCode);
        }
        return ServerErr;
    })()
];

RES_TYPES.forEach((resType) => {
    resType.prototype = Object.create(Res.prototype);
    resType.prototype.constructor = resType;
    Res[resType.name] = resType;
});

module.exports = Res;
