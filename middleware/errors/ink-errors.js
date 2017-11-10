const appConfig = require('../../config/app.config');
const InkError = require('../../common/models/ink-errors');
const Res = require('../../common/models/responses');


const ERROR_MAP = new Map([
    [InkError.BadReq, Res.BadReq],
    [InkError.BadAuthentication, Res.UnAuth],
    [InkError.NotFound, Res.NotFound]
]);


module.exports = function(err, req, res, next) {
    if (!(err instanceof InkError)) {
        next(err);
        return;
    }
    
    let resType = ERROR_MAP.get(err.constructor);
    let payload = null;

    if (!resType) {
        let details = `No response is defined for this error: ${err.constructor.name}.`;
        payload = new Res.ServerErr({
            details: appConfig.env === 'dev' ? details : undefined
        });
    } else {
        payload = new resType({ 
            message: err.message, 
            details: err.details,
            data: err.data
        });
    }

    res.status(payload.status).json(payload);
}
