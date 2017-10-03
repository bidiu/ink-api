const Err = require('../common/err');


exports.errorHandler = function(err, req, res, next) {
	if (err instanceof Err) {
		res.status(err.status).json(err);
	} else {
		next(err);
	}
}
