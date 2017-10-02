const http = require('http');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/errors');
const apiRouter = require('./routers/api/api');


// inkbook.io/api
const app = express();


// load global middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// load routers
app.use('/api', apiRouter);

// 404 and forward to error handler
app.use(function(req, res, next) {
	let err = new Error();
	err.status = 404;
	err.message = 'Not Found';
	next(err);
});

// handle errors
app.use(errorHandler);


// create the api server itself and listen
http.createServer(app).listen(3000);
