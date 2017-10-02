// error handler
module.exports = function(err, req, res, next) {
	if (!err) {
		var err = new Error();
		err.status = 500;
		err.message = 'Unknown Server Error';
	}
	res.status(err.status).json(err);
};
