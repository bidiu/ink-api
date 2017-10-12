const Sequelize = require('sequelize');
const Res = require('../common/models/responses');


module.exports = function(err, req, res, next) {
	if (!(err instanceof Sequelize.Error)) {
        next(err);
        return;
    }

    if (err instanceof Sequelize.ValidationError) {
        // validation error
        onValidationError(err, req, res, next);
    } else {
        // non-validation error (like db connection error)
        onNonValidationError(err, req, res, next);
    }
}


function onValidationError(err, req, res, next) {
    let payload = null;
    if (err.errors instanceof Array) {
        let details = {
            validationErrors: err.errors.map((error) => {
                return {
                    message: error.message,
                    type: error.type,
                    field: error.path,
                    value: error.value
                };
            })
        };
        payload = new Res.BadReq({ details: details })
    } else {
        // TODO need a logging infrastructure
        console.error(err);
        payload = new Res.BadReq({ message: 'Bad Request (Reason Unknown)' });
    }
    res.status(payload.status).json(payload);
}

function onNonValidationError(err, req, res, next) {
    // TODO need a logging infrastructure
    console.error(err);
    let payload = new Res.ServerErr();
    res.status(payload.status).json(payload);
}
