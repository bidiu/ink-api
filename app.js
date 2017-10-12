const http = require('http');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const apiRouter = require('./routers/api/api');
const notFoundHandler = require('./middleware/not-found');
const inkErrorHandler = require('./middleware/ink-errors');
const sequelizeErrorHandler = require('./middleware/sequelize-errors');
const errorHandler = require('./middleware/errors');


const app = express();


// load global middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// load routers
app.use('/api', apiRouter);

// 404 handler
app.use(notFoundHandler);

// error handlers
app.use(inkErrorHandler);
app.use(sequelizeErrorHandler);
app.use(errorHandler);


// create the api server itself and listen
http.createServer(app).listen(3000);
