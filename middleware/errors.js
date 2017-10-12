const Sequelize = require('sequelize');


/**
 * The last error handler.
 */
module.exports = function(err, req, res, next) {
	// programing error, let express to handle that
	next(err);
}
