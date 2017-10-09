const Sequelize = require('sequelize');
const Err = require('../common/err');


module.exports = function(err, req, res, next) {
	if (!(err instanceof Sequelize.Error)) { next(err); }

    if (err instanceof Sequelize.ValidationError) {
        // validation error
        onValidationError(err, req, res, next);
    } else {
        // non-validation error (like db connection error)
        onNonValidationError(err, req, res, next);
    }
}


function onValidationError(err, req, res, next) {
    if (err.errors instanceof Array) {
        details = {
            validationErrors: err.errors.map((error) => {
                return {
                    message: error.message,
                    type: error.type,
                    field: error.path,
                    value: error.value
                };
            })
        };
        next(new Err(400, details));
    } else {
        // TODO need a logging infrastructure
        console.error(err);
        next(new Err(400, 'Bad request (Unknown reason).'));
    }
}

function onNonValidationError(err, req, res, next) {
    // TODO need a logging infrastructure
    console.error(err);
    next(new Err(500, 'Server run into an error while processing your request.'));
}
