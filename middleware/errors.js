const Err = require('../common/err');


function sanitizeValidationErr(err) {
	if (err.message && err.message.errors) {
		return new Err(err.status, err.message.errors);
	}
	return err;
}


exports.errorHandler = function(err, req, res, next) {
	if (err instanceof Err) {
		res.status(err.status).json(sanitizeValidationErr(err));
	} else {
		next(err);
	}
}
