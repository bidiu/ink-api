const Sequelize = require('sequelize');
const Err = require('../common/err');


module.exports = function(err, req, res, next) {
	if (err instanceof Err) {
		res.status(err.status).json(err);
	} else {
		// programing error, let express to handle that
		next(err);
	}
}
